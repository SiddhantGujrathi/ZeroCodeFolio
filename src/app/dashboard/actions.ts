'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getAboutCollection, type About } from '@/models/About';
import { getSkillsCollection } from '@/models/Skill';
import { getProjectsCollection } from '@/models/Project';
import { getAchievementsCollection } from '@/models/Achievement';
import { getCertificationsCollection } from '@/models/Certification';
import { getEducationCollection } from '@/models/Education';
import { getWorkExperienceCollection } from '@/models/WorkExperience';
import { getProfileLinksCollection } from '@/models/ProfileLink';


export type AdminFormState = {
  message: string | null;
  errors?: Record<string, string[] | undefined>;
  success?: boolean;
}

const aboutSchema = z.object({
    name: z.string().min(1, "Name is required"),
    bio: z.string().min(1, "Bio is required"),
    location: z.string().min(1, "Location is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone is required"),
    resumeUrl: z.string().url("Must be a valid URL"),
    profileImage: z.string().min(1, "Profile image is required"),
});

const skillSchema = z.object({
  title: z.string().min(1, "Skill title is required"),
  image: z.string().min(1, "Image is required"),
  imageAiHint: z.string().optional(),
});

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.string().min(1, "Tags are required"),
  projectImage: z.string().min(1, "Image is required"),
  imageAiHint: z.string().optional(),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

const achievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
  imageAiHint: z.string().optional(),
});

const certificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuedBy: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  certificateUrl: z.string().url("Must be a valid URL"),
  image: z.string().min(1, "Image is required"),
  imageAiHint: z.string().optional(),
});

const educationSchema = z.object({
  collegeName: z.string().min(1, "College name is required"),
  degreeName: z.string().min(1, "Degree name is required"),
  period: z.string().min(1, "Period is required"),
  cgpa: z.string().min(1, "CGPA is required"),
  icon: z.string().min(1, "Icon name is required"),
  iconHint: z.string().optional(),
});

const workExperienceSchema = z.object({
  role: z.string().min(1, "Role is required"),
  companyName: z.string().min(1, "Company name is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon name is required"),
  iconHint: z.string().optional(),
});

const profileLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Must be a valid URL"),
  icon: z.string().min(1, "Icon name is required"),
  iconHint: z.string().optional(),
});


// Generic action handler
async function handleForm<T extends z.ZodType<any, any>>(
    schema: T,
    formData: FormData,
    dbOperation: (data: z.infer<T>) => Promise<any>
): Promise<AdminFormState> {
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsed.success) {
        return {
            message: 'Invalid form data.',
            errors: parsed.error.flatten().fieldErrors,
            success: false,
        };
    }

    try {
        await dbOperation(parsed.data);
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Operation successful!', success: true, errors: {} };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { message: `Operation failed: ${errorMessage}`, success: false, errors: {} };
    }
}

export async function updateAbout(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const aboutCollection = await getAboutCollection();
    const dataFromForm = Object.fromEntries(formData.entries());

    const parsed = aboutSchema.safeParse(dataFromForm);

    if (!parsed.success) {
        return {
            message: 'Invalid form data. Please ensure all fields are correctly filled.',
            errors: parsed.error.flatten().fieldErrors,
            success: false,
        };
    }

    try {
        const existingData = await aboutCollection.findOne({});
        const updatePayload: Partial<About> = {};

        for (const key in parsed.data) {
            if (Object.prototype.hasOwnProperty.call(parsed.data, key)) {
                const formValue = parsed.data[key as keyof typeof parsed.data];
                const existingValue = existingData ? existingData[key as keyof typeof existingData] : undefined;
                
                if (formValue !== existingValue) {
                    (updatePayload as any)[key] = formValue;
                }
            }
        }

        if (Object.keys(updatePayload).length === 0) {
            return { message: "No changes to update.", success: true, errors: {} };
        }

        await aboutCollection.updateOne({}, { $set: updatePayload }, { upsert: true });
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'About section updated successfully!', success: true, errors: {} };

    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { message: `Operation failed: ${errorMessage}`, success: false, errors: {} };
    }
}


export async function addSkill(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const skillsCollection = await getSkillsCollection();
  return handleForm(skillSchema, formData, async (data) => skillsCollection.insertOne(data));
}

export async function addProject(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const projectsCollection = await getProjectsCollection();
  return handleForm(projectSchema, formData, async (data) => {
    const { tags, ...rest } = data;
    return projectsCollection.insertOne({
      ...rest,
      tags: tags.split(',').map(tag => tag.trim()),
      createdAt: new Date(),
    });
  });
}

export async function addAchievement(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const achievementsCollection = await getAchievementsCollection();
    return handleForm(achievementSchema, formData, async (data) => achievementsCollection.insertOne(data));
}

export async function addCertification(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const certificationsCollection = await getCertificationsCollection();
    return handleForm(certificationSchema, formData, async (data) => certificationsCollection.insertOne(data));
}

export async function addEducation(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const educationCollection = await getEducationCollection();
    return handleForm(educationSchema, formData, async (data) => educationCollection.insertOne(data));
}

export async function addWorkExperience(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const workExperienceCollection = await getWorkExperienceCollection();
    return handleForm(workExperienceSchema, formData, async (data) => workExperienceCollection.insertOne(data));
}

export async function addProfileLink(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const profileLinksCollection = await getProfileLinksCollection();
    return handleForm(profileLinkSchema, formData, async (data) => profileLinksCollection.insertOne(data));
}

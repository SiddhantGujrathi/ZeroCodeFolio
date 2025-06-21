'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getAboutCollection, type About } from '@/models/About';
import { getSkillsCollection, type Skill } from '@/models/Skill';
import { getProjectsCollection, type Project } from '@/models/Project';
import { getAchievementsCollection } from '@/models/Achievement';
import { getCertificationsCollection } from '@/models/Certification';
import { getEducationCollection } from '@/models/Education';
import { getWorkExperienceCollection } from '@/models/WorkExperience';
import { getProfileLinksCollection } from '@/models/ProfileLink';
import { ObjectId } from 'mongodb';


export type AdminFormState = {
  message: string | null;
  errors?: Record<string, string[] | undefined>;
  success?: boolean;
}

const aboutSchema = z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    email: z.string().email("Invalid email address").or(z.literal('')).optional(),
    phone: z.string().optional(),
    resumeUrl: z.string().url("Must be a valid URL").or(z.literal('')).optional(),
    profileImage: z.string().optional(),
});

const partialAboutSchema = aboutSchema.partial();

const skillSchema = z.object({
  title: z.string().min(1, "Skill title is required"),
  image: z.string().optional(),
  imageAiHint: z.string().optional(),
});

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.string().min(1, "Tags are required"),
  projectImage: z.string().optional(),
  imageAiHint: z.string().optional(),
  websiteUrl: z.string().url("Must be a valid URL").or(z.literal('')).optional(),
  githubUrl: z.string().url("Must be a valid URL").or(z.literal('')).optional(),
});

const achievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
  imageAiHint: z.string().optional(),
});

const certificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuedBy: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  certificateUrl: z.string().url("Must be a valid URL"),
  image: z.string().optional(),
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

export async function updateAbout(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const aboutCollection = await getAboutCollection();
    const dataFromForm = Object.fromEntries(formData.entries());

    const fieldName = Object.keys(dataFromForm)[0];

    if (!fieldName) {
        return { message: "No data submitted.", success: false, errors: {} };
    }
    
    const parsed = partialAboutSchema.safeParse(dataFromForm);

    if (!parsed.success) {
        return {
            message: 'Invalid form data. Please ensure all fields are correctly filled.',
            errors: parsed.error.flatten().fieldErrors,
            success: false,
        };
    }

    try {
        await aboutCollection.updateOne({}, { $set: parsed.data }, { upsert: true });
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: `'${fieldName}' updated successfully!`, success: true, errors: {} };

    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { message: `Operation failed: ${errorMessage}`, success: false, errors: {} };
    }
}

export async function addSkill(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = skillSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
        return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
    }
    try {
        const skillsCollection = await getSkillsCollection();
        const dataToInsert = { ...parsed.data };
        if (!dataToInsert.image) delete (dataToInsert as Partial<typeof dataToInsert>).image;
        if (!dataToInsert.imageAiHint) delete (dataToInsert as Partial<typeof dataToInsert>).imageAiHint;

        const result = await skillsCollection.insertOne(dataToInsert);
        if (!result.acknowledged) {
            return { message: 'Database did not acknowledge the insert operation.', success: false };
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Skill added successfully!', success: true, errors: {} };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { message: `Operation failed: ${errorMessage}`, success: false, errors: {} };
    }
}

export async function addProject(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = projectSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
        return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
    }
    try {
        const projectsCollection = await getProjectsCollection();
        const { tags, ...rest } = parsed.data;
        const dataToInsert = {
            ...rest,
            tags: tags.split(',').map(tag => tag.trim()),
            createdAt: new Date(),
        };

        if (!dataToInsert.projectImage) delete (dataToInsert as Partial<typeof dataToInsert>).projectImage;
        if (!dataToInsert.imageAiHint) delete (dataToInsert as Partial<typeof dataToInsert>).imageAiHint;
        if (!dataToInsert.websiteUrl) delete (dataToInsert as Partial<typeof dataToInsert>).websiteUrl;
        if (!dataToInsert.githubUrl) delete (dataToInsert as Partial<typeof dataToInsert>).githubUrl;


        const result = await projectsCollection.insertOne(dataToInsert);
        if (!result.acknowledged) {
            return { message: 'Database did not acknowledge the insert operation.', success: false };
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Project added successfully!', success: true, errors: {} };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { message: `Operation failed: ${errorMessage}`, success: false, errors: {} };
    }
}

export async function addAchievement(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = achievementSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
        return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
    }
    try {
        const achievementsCollection = await getAchievementsCollection();
        const dataToInsert = { ...parsed.data };
        if (!dataToInsert.image) delete (dataToInsert as Partial<typeof dataToInsert>).image;
        if (!dataToInsert.imageAiHint) delete (dataToInsert as Partial<typeof dataToInsert>).imageAiHint;

        const result = await achievementsCollection.insertOne(dataToInsert);
        if (!result.acknowledged) {
            return { message: 'Database did not acknowledge the insert operation.', success: false };
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Achievement added successfully!', success: true, errors: {} };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { message: `Operation failed: ${errorMessage}`, success: false, errors: {} };
    }
}

export async function addCertification(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = certificationSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
        return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
    }
    try {
        const certificationsCollection = await getCertificationsCollection();
        const dataToInsert = { ...parsed.data };
        if (!dataToInsert.image) delete (dataToInsert as Partial<typeof dataToInsert>).image;
        if (!dataToInsert.imageAiHint) delete (dataToInsert as Partial<typeof dataToInsert>).imageAiHint;

        const result = await certificationsCollection.insertOne(dataToInsert);
        if (!result.acknowledged) {
            return { message: 'Database did not acknowledge the insert operation.', success: false };
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Certification added successfully!', success: true, errors: {} };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { message: `Operation failed: ${errorMessage}`, success: false, errors: {} };
    }
}

export async function addEducation(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = educationSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
        return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
    }
    try {
        const educationCollection = await getEducationCollection();
        const dataToInsert = { ...parsed.data };
        if (!dataToInsert.iconHint) delete (dataToInsert as Partial<typeof dataToInsert>).iconHint;

        const result = await educationCollection.insertOne(dataToInsert);
        if (!result.acknowledged) {
            return { message: 'Database did not acknowledge the insert operation.', success: false };
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Education added successfully!', success: true, errors: {} };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { message: `Operation failed: ${errorMessage}`, success: false, errors: {} };
    }
}

export async function addWorkExperience(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = workExperienceSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
        return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
    }
    try {
        const workExperienceCollection = await getWorkExperienceCollection();
        const dataToInsert = { ...parsed.data };
        if (!dataToInsert.iconHint) delete (dataToInsert as Partial<typeof dataToInsert>).iconHint;

        const result = await workExperienceCollection.insertOne(dataToInsert);
        if (!result.acknowledged) {
            return { message: 'Database did not acknowledge the insert operation.', success: false };
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Work experience added successfully!', success: true, errors: {} };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { message: `Operation failed: ${errorMessage}`, success: false, errors: {} };
    }
}

export async function addProfileLink(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = profileLinkSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
        return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
    }
    try {
        const profileLinksCollection = await getProfileLinksCollection();
        const dataToInsert = { ...parsed.data };
        if (!dataToInsert.iconHint) delete (dataToInsert as Partial<typeof dataToInsert>).iconHint;

        const result = await profileLinksCollection.insertOne(dataToInsert);
        if (!result.acknowledged) {
            return { message: 'Database did not acknowledge the insert operation.', success: false };
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Profile link added successfully!', success: true, errors: {} };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { message: `Operation failed: ${errorMessage}`, success: false, errors: {} };
    }
}


const deleteSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export async function deleteSkill(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = deleteSchema.safeParse({ id: formData.get('id') });
    if (!parsed.success) { return { message: 'Invalid ID.', success: false }; }
    try {
        const collection = await getSkillsCollection();
        await collection.deleteOne({ _id: new ObjectId(parsed.data.id) });
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Skill deleted.', success: true };
    } catch (e) {
        return { message: 'Deletion failed.', success: false };
    }
}

export async function deleteProject(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = deleteSchema.safeParse({ id: formData.get('id') });
    if (!parsed.success) { return { message: 'Invalid ID.', success: false }; }
    try {
        const collection = await getProjectsCollection();
        await collection.deleteOne({ _id: new ObjectId(parsed.data.id) });
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Project deleted.', success: true };
    } catch (e) {
        return { message: 'Deletion failed.', success: false };
    }
}

export async function deleteAchievement(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = deleteSchema.safeParse({ id: formData.get('id') });
    if (!parsed.success) { return { message: 'Invalid ID.', success: false }; }
    try {
        const collection = await getAchievementsCollection();
        await collection.deleteOne({ _id: new ObjectId(parsed.data.id) });
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Achievement deleted.', success: true };
    } catch (e) {
        return { message: 'Deletion failed.', success: false };
    }
}

export async function deleteCertification(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = deleteSchema.safeParse({ id: formData.get('id') });
    if (!parsed.success) { return { message: 'Invalid ID.', success: false }; }
    try {
        const collection = await getCertificationsCollection();
        await collection.deleteOne({ _id: new ObjectId(parsed.data.id) });
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Certification deleted.', success: true };
    } catch (e) {
        return { message: 'Deletion failed.', success: false };
    }
}

export async function deleteEducation(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = deleteSchema.safeParse({ id: formData.get('id') });
    if (!parsed.success) { return { message: 'Invalid ID.', success: false }; }
    try {
        const collection = await getEducationCollection();
        await collection.deleteOne({ _id: new ObjectId(parsed.data.id) });
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Education entry deleted.', success: true };
    } catch (e) {
        return { message: 'Deletion failed.', success: false };
    }
}

export async function deleteWorkExperience(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = deleteSchema.safeParse({ id: formData.get('id') });
    if (!parsed.success) { return { message: 'Invalid ID.', success: false }; }
    try {
        const collection = await getWorkExperienceCollection();
        await collection.deleteOne({ _id: new ObjectId(parsed.data.id) });
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Work experience deleted.', success: true };
    } catch (e) {
        return { message: 'Deletion failed.', success: false };
    }
}

export async function deleteProfileLink(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = deleteSchema.safeParse({ id: formData.get('id') });
    if (!parsed.success) { return { message: 'Invalid ID.', success: false }; }
    try {
        const collection = await getProfileLinksCollection();
        await collection.deleteOne({ _id: new ObjectId(parsed.data.id) });
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Profile link deleted.', success: true };
    } catch (e) {
        return { message: 'Deletion failed.', success: false };
    }
}

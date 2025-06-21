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
    name: z.string(),
    bio: z.string(),
    location: z.string(),
    email: z.string().email("Invalid email address").or(z.literal('')),
    phone: z.string(),
    resumeUrl: z.string().url("Must be a valid URL").or(z.literal('')),
    profileImage: z.string(),
});

const partialAboutSchema = aboutSchema.partial();

const skillSchema = z.object({
  title: z.string().min(1, "Skill title is required"),
  image: z.string(),
  imageAiHint: z.string().optional(),
});

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.string().min(1, "Tags are required"),
  projectImage: z.string(),
  imageAiHint: z.string().optional(),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

const achievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string(),
  imageAiHint: z.string().optional(),
});

const certificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuedBy: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  certificateUrl: z.string().url("Must be a valid URL"),
  image: z.string(),
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

        await skillsCollection.insertOne(dataToInsert);
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


        await projectsCollection.insertOne(dataToInsert);
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

        await achievementsCollection.insertOne(dataToInsert);
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

        await certificationsCollection.insertOne(dataToInsert);
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

        await educationCollection.insertOne(dataToInsert);
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

        await workExperienceCollection.insertOne(dataToInsert);
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

        await profileLinksCollection.insertOne(dataToInsert);
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Profile link added successfully!', success: true, errors: {} };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { message: `Operation failed: ${errorMessage}`, success: false, errors: {} };
    }
}

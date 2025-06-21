'use server';

import { z } from 'zod';
import { getSkillsCollection } from '@/models/Skill';
import { getProjectsCollection } from '@/models/Project';
import { getAchievementsCollection } from '@/models/Achievement';
import { revalidatePath } from 'next/cache';

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  icon: z.string().min(1, "Icon name is required"),
});

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  imageAiHint: z.string().optional(),
  tags: z.string().min(1, "Tags are required"),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

const achievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export type AdminFormState = {
  message: string | null;
  errors?: Record<string, string[] | undefined>;
  success?: boolean;
}

export async function addSkill(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const parsed = skillSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      message: 'Invalid form data.',
      errors: parsed.error.flatten().fieldErrors,
      success: false,
    };
  }
  
  try {
    const skillsCollection = await getSkillsCollection();
    await skillsCollection.insertOne(parsed.data);
    revalidatePath('/');
    return { message: 'Skill added successfully!', success: true };
  } catch (e) {
    console.error(e);
    return { message: 'Failed to add skill.', success: false };
  }
}

export async function addProject(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const parsed = projectSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!parsed.success) {
    return {
      message: 'Invalid form data.',
      errors: parsed.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { title, description, tags, githubUrl, websiteUrl, image, imageAiHint } = parsed.data;

  const projectLinks = [];
  if (websiteUrl) {
    projectLinks.push({ name: 'Website', url: websiteUrl, icon: 'ExternalLink' });
  }
  if (githubUrl) {
    projectLinks.push({ name: 'GitHub', url: githubUrl, icon: 'Github' });
  }

  try {
    const projectsCollection = await getProjectsCollection();
    await projectsCollection.insertOne({
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      links: projectLinks,
      image: image || `https://placehold.co/600x400.png`,
      imageAiHint: imageAiHint || 'project placeholder',
    });
    revalidatePath('/');
    return { message: 'Project added successfully!', success: true };
  } catch (e) {
    console.error(e);
    return { message: 'Failed to add project.', success: false };
  }
}

export async function addAchievement(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const parsed = achievementSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      message: 'Invalid form data.',
      errors: parsed.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const achievementsCollection = await getAchievementsCollection();
    await achievementsCollection.insertOne(parsed.data);
    revalidatePath('/');
    return { message: 'Achievement added successfully!', success: true };
  } catch (e) {
    console.error(e);
    return { message: 'Failed to add achievement.', success: false };
  }
}

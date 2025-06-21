'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export type AdminFormState = {
  message: string | null;
  errors?: Record<string, string[] | undefined>;
  success?: boolean;
}

export type SetupResult = {
    overall: { success: boolean; message: string };
    details: { collection: string; status: 'success' | 'error'; message:string }[];
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
  icon: z.string().optional(),
  iconHint: z.string().optional(),
});

const workExperienceSchema = z.object({
  role: z.string().min(1, "Role is required"),
  companyName: z.string().min(1, "Company name is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().optional(),
  iconHint: z.string().optional(),
});

const profileLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Must be a valid URL"),
  icon: z.string().optional(),
  iconHint: z.string().optional(),
});

async function getCollection(collectionName: string) {
    const client = await clientPromise;
    const db = client.db('portfolio');
    return db.collection(collectionName);
}

const DB_CONN_ERROR = "Database Connection Failed. Please ensure your current IP address is whitelisted in MongoDB Atlas under 'Network Access' and that your MONGODB_URI is correct.";
const UNEXPECTED_ERROR = "An unexpected error occurred. Please check your database credentials and permissions.";

function handleDbError(e: unknown): AdminFormState {
    const errorMessage = e instanceof Error ? e.message : String(e);
    if (e instanceof Error && (e.name === 'MongoNetworkError' || e.message.includes('timed out'))) {
        return { message: `${DB_CONN_ERROR} Full error: ${errorMessage}`, success: false };
    }
    return { message: `${UNEXPECTED_ERROR} Full error: ${errorMessage}`, success: false };
}


export async function updateAbout(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    try {
        const dataFromForm = Object.fromEntries(formData.entries());
        const fieldName = Object.keys(dataFromForm)[0];
        if (!fieldName) {
            return { message: "No data submitted.", success: false };
        }
        
        const parsed = partialAboutSchema.safeParse(dataFromForm);

        if (!parsed.success) {
            return {
                message: 'Invalid form data.',
                errors: parsed.error.flatten().fieldErrors,
                success: false,
            };
        }
        
        const updateData = parsed.data;

        const aboutCollection = await getCollection('about');
        let operation: any;

        if (updateData.profileImage?.startsWith('data:image/')) {
            operation = { $set: { profileImage: updateData.profileImage } };
        } else if (updateData.profileImage === '') {
            operation = { $unset: { profileImage: "" } };
        } else {
            operation = { $set: updateData };
        }
        
        await aboutCollection.updateOne({}, operation, { upsert: true });

        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: `'${fieldName}' updated successfully!`, success: true };

    } catch (e) {
        console.error("Failed to update about section:", e);
        return handleDbError(e);
    }
}

export async function addSkill(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    try {
        const parsed = skillSchema.safeParse(Object.fromEntries(formData.entries()));
        if (!parsed.success) {
            return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
        }

        const dataToInsert = { ...parsed.data };
        if (!dataToInsert.image) {
            delete dataToInsert.image;
        }

        const skillsCollection = await getCollection('skills');
        await skillsCollection.insertOne(dataToInsert);
        
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Skill added successfully!', success: true };

    } catch (e) {
        console.error("Failed to add skill:", e);
        return handleDbError(e);
    }
}


export async function addProject(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    try {
        const parsed = projectSchema.safeParse(Object.fromEntries(formData.entries()));
        if (!parsed.success) {
            return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
        }

        const { tags, ...rest } = parsed.data;
        const dataToInsert: any = {
            ...rest,
            tags: tags.split(',').map(tag => tag.trim()),
            createdAt: new Date(),
        };

        if (!dataToInsert.projectImage) {
            delete dataToInsert.projectImage;
        }

        const projectsCollection = await getCollection('projects');
        await projectsCollection.insertOne(dataToInsert);

        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Project added successfully!', success: true };
    } catch (e) {
        console.error("Failed to add project:", e);
        return handleDbError(e);
    }
}

export async function addAchievement(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    try {
        const parsed = achievementSchema.safeParse(Object.fromEntries(formData.entries()));
        if (!parsed.success) {
            return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
        }

        const dataToInsert: any = { ...parsed.data };

        if (!dataToInsert.image) {
            delete dataToInsert.image;
        }

        const achievementsCollection = await getCollection('achievements');
        await achievementsCollection.insertOne(dataToInsert);

        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Achievement added successfully!', success: true };
    } catch (e) {
        console.error("Failed to add achievement:", e);
        return handleDbError(e);
    }
}

export async function addCertification(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    try {
        const parsed = certificationSchema.safeParse(Object.fromEntries(formData.entries()));
        if (!parsed.success) {
            return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
        }
        const dataToInsert: any = { ...parsed.data };
        
        if (!dataToInsert.image) {
            delete dataToInsert.image;
        }

        const certificationsCollection = await getCollection('certifications');
        await certificationsCollection.insertOne(dataToInsert);

        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Certification added successfully!', success: true };
    } catch (e) {
        console.error("Failed to add certification:", e);
        return handleDbError(e);
    }
}

export async function addEducation(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    try {
        const parsed = educationSchema.safeParse(Object.fromEntries(formData.entries()));
        if (!parsed.success) {
            return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
        }

        const dataToInsert = { ...parsed.data };
        if (!dataToInsert.icon) {
            delete dataToInsert.icon;
        }
        
        const educationCollection = await getCollection('education');
        await educationCollection.insertOne(dataToInsert);

        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Education added successfully!', success: true };
    } catch (e) {
        console.error("Failed to add education:", e);
        return handleDbError(e);
    }
}

export async function addWorkExperience(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    try {
        const parsed = workExperienceSchema.safeParse(Object.fromEntries(formData.entries()));
        if (!parsed.success) {
            return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
        }
        const dataToInsert = { ...parsed.data };
        if (!dataToInsert.icon) {
            delete dataToInsert.icon;
        }

        const workExperienceCollection = await getCollection('workExperience');
        await workExperienceCollection.insertOne(dataToInsert);

        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Work experience added successfully!', success: true };
    } catch (e) {
        console.error("Failed to add work experience:", e);
        return handleDbError(e);
    }
}

export async function addProfileLink(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    try {
        const parsed = profileLinkSchema.safeParse(Object.fromEntries(formData.entries()));
        if (!parsed.success) {
            return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
        }
        const dataToInsert = { ...parsed.data };
        if (!dataToInsert.icon) {
            delete dataToInsert.icon;
        }

        const profileLinksCollection = await getCollection('profileLinks');
        await profileLinksCollection.insertOne(dataToInsert);

        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Profile link added successfully!', success: true };
    } catch (e) {
        console.error("Failed to add profile link:", e);
        return handleDbError(e);
    }
}

const deleteSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

async function deleteItem(collectionName: string, id: string): Promise<AdminFormState> {
    try {
        const collection = await getCollection(collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return { message: 'Database Error: Could not find the item to delete. It may have already been removed.', success: false };
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Item deleted successfully.', success: true };
    } catch (e) {
        console.error(`Failed to delete item from ${collectionName}:`, e);
        return handleDbError(e);
    }
}

export async function deleteSkill(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = deleteSchema.safeParse({ id: formData.get('id') });
    if (!parsed.success) { return { message: 'Invalid ID.', success: false }; }
    return deleteItem('skills', parsed.data.id);
}

export async function deleteProject(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = deleteSchema.safeParse({ id: formData.get('id') });
    if (!parsed.success) { return { message: 'Invalid ID.', success: false }; }
    return deleteItem('projects', parsed.data.id);
}

export async function deleteAchievement(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = deleteSchema.safeParse({ id: formData.get('id') });
    if (!parsed.success) { return { message: 'Invalid ID.', success: false }; }
    return deleteItem('achievements', parsed.data.id);
}

export async function deleteCertification(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = deleteSchema.safeParse({ id: formData.get('id') });
    if (!parsed.success) { return { message: 'Invalid ID.', success: false }; }
    return deleteItem('certifications', parsed.data.id);
}

export async function deleteEducation(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = deleteSchema.safeParse({ id: formData.get('id') });
    if (!parsed.success) { return { message: 'Invalid ID.', success: false }; }
    return deleteItem('education', parsed.data.id);
}

export async function deleteWorkExperience(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = deleteSchema.safeParse({ id: formData.get('id') });
    if (!parsed.success) { return { message: 'Invalid ID.', success: false }; }
    return deleteItem('workExperience', parsed.data.id);
}

export async function deleteProfileLink(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = deleteSchema.safeParse({ id: formData.get('id') });
    if (!parsed.success) { return { message: 'Invalid ID.', success: false }; }
    return deleteItem('profileLinks', parsed.data.id);
}

export async function setupDatabase(prevState: SetupResult | null, formData: FormData): Promise<SetupResult> {
    const collectionsToCreate = [
        'about', 'skills', 'projects', 'achievements',
        'certifications', 'education', 'workExperience', 'profileLinks'
    ];

    const results: { collection: string; status: 'success' | 'error'; message: string }[] = [];
    
    try {
        const client = await clientPromise;
        const db = client.db('portfolio');
        
        let existingCollectionNames: string[] = [];
        try {
            const existingCollections = await db.listCollections().toArray();
            existingCollectionNames = existingCollections.map(c => c.name);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            return {
                overall: {
                    success: false,
                    message: `Failed to list collections. This is likely a permissions issue. The connected user needs the 'listCollections' privilege on the 'portfolio' database. Full error: ${errorMessage}`
                },
                details: []
            };
        }

        for (const collectionName of collectionsToCreate) {
            if (existingCollectionNames.includes(collectionName)) {
                results.push({
                    collection: collectionName,
                    status: 'success',
                    message: 'Collection already exists.',
                });
                continue;
            }

            try {
                await db.createCollection(collectionName);
                results.push({
                    collection: collectionName,
                    status: 'success',
                    message: 'Successfully created collection.',
                });
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : String(e);
                results.push({
                    collection: collectionName,
                    status: 'error',
                    message: `Failed to create: ${errorMessage}`,
                });
            }
        }
        
        const hasErrors = results.some(r => r.status === 'error');

        return {
            overall: {
                success: !hasErrors,
                message: !hasErrors
                    ? 'All required collections are present and accessible.'
                    : 'One or more collections could not be created. This is likely a permissions issue. The connected user may need the `dbAdmin` role on the \'portfolio\' database.'
            },
            details: results
        };

    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        return {
            overall: {
                success: false,
                message: `Could not connect to the database. Please ensure your Connection String (MONGODB_URI) is correct and your server's IP is whitelisted in MongoDB Atlas. Full error: ${errorMessage}`
            },
            details: []
        };
    }
}

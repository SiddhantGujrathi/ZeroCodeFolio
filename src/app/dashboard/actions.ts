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
    details: { collection: string; status: 'success' | 'error'; message: string }[];
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

async function getCollection(collectionName: string) {
    const client = await clientPromise;
    const db = client.db('portfolio');
    return db.collection(collectionName);
}

const DB_ERROR_MESSAGE = 'Database Connection Error. Please ensure your IP address is whitelisted in MongoDB Atlas and that your MONGODB_URI environment variable is correct.';

export async function updateAbout(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
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

    try {
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
        if (e instanceof Error && e.name === 'MongoNetworkError') {
            return { message: DB_ERROR_MESSAGE, success: false };
        }
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { message: `Failed to update. An unexpected error occurred: ${errorMessage}`, success: false };
    }
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

    const dataToInsert = parsed.data;

    try {
        if (dataToInsert.image === '') {
            dataToInsert.image = undefined;
        }

        const skillsCollection = await getCollection('skills');
        const result = await skillsCollection.insertOne(dataToInsert);

        if (!result.insertedId) {
            return { 
                message: 'Database Error: The skill was not saved. The operation was not acknowledged by the database.', 
                success: false 
            };
        }
        
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Skill added successfully!', success: true };

    } catch (e) {
        console.error("Critical error in addSkill:", e);
        const errorMessage = e instanceof Error ? e.message : String(e);

        if (e instanceof Error && (e.name === 'MongoNetworkError' || e.message.includes('timed out'))) {
            return { 
                message: `Database Connection Failed. Please ensure your current IP address is whitelisted in MongoDB Atlas under 'Network Access'. Full error: ${errorMessage}`, 
                success: false 
            };
        }

        return { 
            message: `An unexpected error occurred while adding the skill. Please check your database credentials and permissions. Full error: ${errorMessage}`, 
            success: false 
        };
    }
}


export async function addProject(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
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

    try {
        if (dataToInsert.projectImage === '') {
            dataToInsert.projectImage = undefined;
        }

        const projectsCollection = await getCollection('projects');
        const result = await projectsCollection.insertOne(dataToInsert);
        if (!result.insertedId) {
            return { message: 'Database Error: The project was not saved. The operation was not acknowledged by the database.', success: false };
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Project added successfully!', success: true };
    } catch (e) {
        console.error("Failed to add project:", e);
        if (e instanceof Error && e.name === 'MongoNetworkError') {
            return { message: DB_ERROR_MESSAGE, success: false };
        }
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { message: `Failed to add project. An unexpected error occurred: ${errorMessage}`, success: false };
    }
}

export async function addAchievement(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = achievementSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
        return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
    }

    const dataToInsert: any = parsed.data;

    try {
        if (dataToInsert.image === '') {
            dataToInsert.image = undefined;
        }

        const achievementsCollection = await getCollection('achievements');
        const result = await achievementsCollection.insertOne(dataToInsert);
        if (!result.insertedId) {
            return { message: 'Database Error: The achievement was not saved. The operation was not acknowledged by the database.', success: false };
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Achievement added successfully!', success: true };
    } catch (e) {
        console.error("Failed to add achievement:", e);
        if (e instanceof Error && e.name === 'MongoNetworkError') {
            return { message: DB_ERROR_MESSAGE, success: false };
        }
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { message: `Failed to add achievement. An unexpected error occurred: ${errorMessage}`, success: false };
    }
}

export async function addCertification(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = certificationSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
        return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
    }
    const dataToInsert: any = parsed.data;
    try {
        if (dataToInsert.image === '') {
            dataToInsert.image = undefined;
        }

        const certificationsCollection = await getCollection('certifications');
        const result = await certificationsCollection.insertOne(dataToInsert);
        if (!result.insertedId) {
            return { message: 'Database Error: The certification was not saved. The operation was not acknowledged by the database.', success: false };
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Certification added successfully!', success: true };
    } catch (e) {
        console.error("Failed to add certification:", e);
        if (e instanceof Error && e.name === 'MongoNetworkError') {
            return { message: DB_ERROR_MESSAGE, success: false };
        }
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { message: `Failed to add certification. An unexpected error occurred: ${errorMessage}`, success: false };
    }
}

export async function addEducation(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = educationSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
        return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
    }
    try {
        const educationCollection = await getCollection('education');
        const result = await educationCollection.insertOne(parsed.data);
        if (!result.insertedId) {
            return { message: 'Database Error: The education record was not saved. The operation was not acknowledged by the database.', success: false };
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Education added successfully!', success: true };
    } catch (e) {
        console.error("Failed to add education:", e);
        if (e instanceof Error && e.name === 'MongoNetworkError') {
            return { message: DB_ERROR_MESSAGE, success: false };
        }
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { message: `Failed to add education record. An unexpected error occurred: ${errorMessage}`, success: false };
    }
}

export async function addWorkExperience(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = workExperienceSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
        return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
    }
    try {
        const workExperienceCollection = await getCollection('workExperience');
        const result = await workExperienceCollection.insertOne(parsed.data);
        if (!result.insertedId) {
            return { message: 'Database Error: The work experience was not saved. The operation was not acknowledged by the database.', success: false };
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Work experience added successfully!', success: true };
    } catch (e) {
        console.error("Failed to add work experience:", e);
        if (e instanceof Error && e.name === 'MongoNetworkError') {
            return { message: DB_ERROR_MESSAGE, success: false };
        }
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { message: `Failed to add work experience. An unexpected error occurred: ${errorMessage}`, success: false };
    }
}

export async function addProfileLink(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
    const parsed = profileLinkSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) {
        return { message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors, success: false };
    }
    try {
        const profileLinksCollection = await getCollection('profileLinks');
        const result = await profileLinksCollection.insertOne(parsed.data);
        if (!result.insertedId) {
            return { message: 'Database Error: The profile link was not saved. The operation was not acknowledged by the database.', success: false };
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { message: 'Profile link added successfully!', success: true };
    } catch (e) {
        console.error("Failed to add profile link:", e);
        if (e instanceof Error && e.name === 'MongoNetworkError') {
            return { message: DB_ERROR_MESSAGE, success: false };
        }
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { message: `Failed to add profile link. An unexpected error occurred: ${errorMessage}`, success: false };
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
        if (e instanceof Error && e.name === 'MongoNetworkError') {
            return { message: DB_ERROR_MESSAGE, success: false };
        }
        const errorMessage = e instanceof Error ? e.message : String(e);
        return { message: `Failed to delete item. An unexpected error occurred: ${errorMessage}`, success: false };
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

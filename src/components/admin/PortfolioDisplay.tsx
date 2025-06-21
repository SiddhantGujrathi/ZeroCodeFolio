
'use client';

import Image from "next/image";
import React, { useActionState, useEffect, useState, useCallback, useMemo, useRef, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Pencil, ArrowUp, ArrowDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminFormState } from "@/app/dashboard/actions";
import { 
    deleteSkill, deleteProject, deleteAchievement, deleteCertification, 
    deleteEducation, deleteWorkExperience, deleteProfileLink,
    updateSkillsOrder
} from "@/app/dashboard/actions";
import { 
    SkillForm, ProjectForm, AchievementForm, CertificationForm, EducationForm, WorkExperienceForm, ProfileLinkForm 
} from './PortfolioForms';
import { SlateViewer } from './SlateViewer';
import { stringToIconMap } from '@/lib/icon-map';

import type { About } from "@/models/About";
import type { Skill } from "@/models/Skill";
import type { Project } from "@/models/Project";
import type { Achievement } from "@/models/Achievement";
import type { Certification } from "@/models/Certification";
import type { Education } from "@/models/Education";
import type { WorkExperience } from "@/models/WorkExperience";
import type { ProfileLink } from "@/models/ProfileLink";


type Client<T> = Omit<T, '_id' | 'collection'> & { _id?: string };


function DeleteItemDialog({ action, itemId, itemName, children }: { 
    action: (prevState: AdminFormState, formData: FormData) => Promise<AdminFormState>, 
    itemId: string,
    itemName: string,
    children: React.ReactNode
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
        const formData = new FormData();
        formData.append('id', itemId);
        const initialState: AdminFormState = { message: null, success: false };
        const result = await action(initialState, formData);
        
        if (result.success) {
            toast({ title: 'Success', description: result.message ?? "Item deleted." });
            setOpen(false);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message ?? "An unknown error occurred." });
        }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
            {children}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete "{itemName}".
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isPending}
                    className={buttonVariants({ variant: "destructive" })}
                >
                    {isPending ? "Deleting..." : "Yes, delete"}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
}


// Dialog Components
function EditSkillDialog({ skill }: { skill: Client<Skill> }) {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => setOpen(false), []);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Skill</DialogTitle>
                </DialogHeader>
                <SkillForm skill={skill} onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
function EditProjectDialog({ project }: { project: Client<Project> }) {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => setOpen(false), []);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>
                <ProjectForm project={project} onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
function EditAchievementDialog({ achievement }: { achievement: Client<Achievement> }) {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => setOpen(false), []);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Achievement</DialogTitle>
                </DialogHeader>
                <AchievementForm achievement={achievement} onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
function EditCertificationDialog({ certification }: { certification: Client<Certification> }) {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => setOpen(false), []);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Certification</DialogTitle>
                </DialogHeader>
                <CertificationForm certification={certification} onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
function EditEducationDialog({ educationItem }: { educationItem: Client<Education> }) {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => setOpen(false), []);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Education</DialogTitle>
                </DialogHeader>
                <EducationForm education={educationItem} onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
function EditWorkExperienceDialog({ experience }: { experience: Client<WorkExperience> }) {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => setOpen(false), []);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Work Experience</DialogTitle>
                </DialogHeader>
                <WorkExperienceForm experience={experience} onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
function EditProfileLinkDialog({ link }: { link: Client<ProfileLink> }) {
    const [open, setOpen] = useState(false);
    const handleSuccess = useCallback(() => setOpen(false), []);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Profile Link</DialogTitle>
                </DialogHeader>
                <ProfileLinkForm link={link} onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}


export function AboutDisplay({ about }: { about: Client<About> | null }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Info</CardTitle>
                <CardDescription>This is the information currently on your portfolio.</CardDescription>
            </CardHeader>
            <CardContent>
            {!about ? (
                 <p className="text-muted-foreground text-center py-4">Nothing is added yet.</p>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary">
                             {about.profileImage && <Image src={about.profileImage} alt={about.name || 'Profile Image'} fill className="object-cover" />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{about.name}</h3>
                            {about.tagline && <p className="text-md font-semibold text-primary">{about.tagline}</p>}
                            <p className="text-muted-foreground">{about.email}</p>
                            <p className="text-muted-foreground">{about.phone} | {about.location}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-semibold">Bio</h4>
                        <SlateViewer value={about.bio} />
                    </div>
                    {about.resumeUrl && (
                         <div className="space-y-2">
                            <h4 className="font-semibold">Resume</h4>
                            <a href={about.resumeUrl} className="text-sm text-primary hover:underline" target="_blank" rel="noopener noreferrer">View Resume</a>
                        </div>
                    )}
                </div>
            )}
            </CardContent>
        </Card>
    );
}

function ReorderSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full mt-4" disabled={pending}>
            {pending ? 'Saving Order...' : 'Save Skill Order'}
        </Button>
    );
}

export function SkillsDisplay({ skills }: { skills: Client<Skill>[] }) {
    const [orderedSkills, setOrderedSkills] = useState(skills);
    const [state, dispatch] = useActionState(updateSkillsOrder, { message: null, success: false });
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        setOrderedSkills(skills);
    }, [skills]);

    useEffect(() => {
        if (state?.message) {
            toast({
                variant: state.success ? 'default' : 'destructive',
                title: state.success ? 'Success!' : 'Error',
                description: state.message,
            });
        }
    }, [state, toast]);

    const moveSkill = (index: number, direction: 'up' | 'down') => {
        const newList = [...orderedSkills];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newList.length) return;
        [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
        setOrderedSkills(newList);
    };

    const skillIdsInOrder = useMemo(() => JSON.stringify(orderedSkills.map(s => s._id)), [orderedSkills]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Skills</CardTitle>
                <CardDescription>The skills currently displayed on your portfolio. Click arrows to reorder, then save.</CardDescription>
            </CardHeader>
            <CardContent>
                {orderedSkills.length > 0 ? (
                    <form ref={formRef} action={dispatch}>
                        <input type="hidden" name="skillsOrder" value={skillIdsInOrder} />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderedSkills.map((skill, index) => (
                                    <TableRow key={skill._id}>
                                        <TableCell>
                                            <div className="relative h-10 w-10 flex items-center justify-center">
                                                {(() => {
                                                    if (skill.image) {
                                                        return <Image src={skill.image} alt={skill.title} fill className="object-contain rounded-md" />;
                                                    }
                                                    if (skill.icon && stringToIconMap[skill.icon]) {
                                                        const IconComponent = stringToIconMap[skill.icon];
                                                        return <IconComponent className="h-8 w-8 text-primary" />;
                                                    }
                                                    return <div className="h-10 w-10 bg-muted rounded-md" />;
                                                })()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{skill.title}</TableCell>
                                        <TableCell className="text-right flex justify-end items-center">
                                            <div className="flex gap-1 mr-2">
                                                <Button type="button" size="icon" variant="ghost" disabled={index === 0} onClick={() => moveSkill(index, 'up')}><ArrowUp className="h-4 w-4" /></Button>
                                                <Button type="button" size="icon" variant="ghost" disabled={index === orderedSkills.length - 1} onClick={() => moveSkill(index, 'down')}><ArrowDown className="h-4 w-4" /></Button>
                                            </div>
                                            <EditSkillDialog skill={skill} />
                                            <DeleteItemDialog action={deleteSkill} itemId={skill._id!} itemName={skill.title}>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </DeleteItemDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <ReorderSubmitButton />
                    </form>
                ) : (
                    <p className="text-muted-foreground text-center py-4">Nothing is added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

export function ProjectsDisplay({ projects }: { projects: Client<Project>[] }) {
     return (
        <Card>
            <CardHeader>
                <CardTitle>Current Projects</CardTitle>
                <CardDescription>The projects currently on your portfolio.</CardDescription>
            </CardHeader>
            <CardContent>
                {projects.length > 0 ? (
                    <div className="space-y-4">
                        {projects.map(project => (
                            <Card key={project._id} className="overflow-hidden flex flex-col sm:flex-row">
                                <div className="sm:w-1/3">
                                    <div className="aspect-video overflow-hidden border-b sm:border-b-0 sm:border-r">
                                        {project.projectImage && <Image src={project.projectImage} alt={project.title} width={400} height={250} className="w-full h-full object-cover" />}
                                    </div>
                                </div>
                                <div className="sm:w-2/3 flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{project.title}</CardTitle>
                                             <div className="flex-shrink-0 flex items-center">
                                                <EditProjectDialog project={project} />
                                                <DeleteItemDialog action={deleteProject} itemId={project._id!} itemName={project.title}>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </DeleteItemDialog>
                                             </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow text-sm mt-1">
                                        <SlateViewer value={project.description} />
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex flex-wrap gap-1">
                                            {project.tags.map(tag => (
                                                <Badge key={tag} variant="secondary">{tag}</Badge>
                                            ))}
                                        </div>
                                    </CardFooter>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-4">Nothing is added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

export function AchievementsDisplay({ achievements }: { achievements: Client<Achievement>[] }) {
     return (
        <Card>
            <CardHeader>
                <CardTitle>Current Achievements</CardTitle>
                <CardDescription>Your proudest achievements.</CardDescription>
            </CardHeader>
            <CardContent>
                {achievements.length > 0 ? (
                    <div className="space-y-4">
                        {achievements.map(achievement => (
                             <Card key={achievement._id} className="overflow-hidden flex flex-col sm:flex-row">
                                <div className="sm:w-1/3">
                                    <div className="aspect-video overflow-hidden border-b sm:border-b-0 sm:border-r">
                                        {achievement.image && <Image src={achievement.image} alt={achievement.title} width={400} height={250} className="w-full h-full object-cover" />}
                                    </div>
                                </div>
                                <div className="sm:w-2/3 flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{achievement.title}</CardTitle>
                                            <div className="flex-shrink-0 flex items-center">
                                                <EditAchievementDialog achievement={achievement} />
                                                <DeleteItemDialog action={deleteAchievement} itemId={achievement._id!} itemName={achievement.title}>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </DeleteItemDialog>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow text-sm mt-1">
                                        <SlateViewer value={achievement.description} />
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-4">Nothing is added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

export function CertificationsDisplay({ certifications }: { certifications: Client<Certification>[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Certifications</CardTitle>
                <CardDescription>Your certifications and credentials.</CardDescription>
            </CardHeader>
            <CardContent>
                {certifications.length > 0 ? (
                     <div className="space-y-4">
                        {certifications.map(cert => (
                             <Card key={cert._id} className="overflow-hidden flex flex-col sm:flex-row">
                                 <div className="sm:w-1/3">
                                    <div className="aspect-video overflow-hidden border-b sm:border-b-0 sm:border-r">
                                        {cert.image && <Image src={cert.image} alt={cert.title} width={400} height={250} className="w-full h-full object-cover" />}
                                    </div>
                                </div>
                               <div className="sm:w-2/3 flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{cert.title}</CardTitle>
                                                <CardDescription className="text-sm mt-1">{cert.issuedBy} - {cert.date}</CardDescription>
                                            </div>
                                            <div className="flex-shrink-0 flex items-center">
                                                <EditCertificationDialog certification={cert} />
                                                <DeleteItemDialog action={deleteCertification} itemId={cert._id!} itemName={cert.title}>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </DeleteItemDialog>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm mt-2 inline-block hover:underline">View Certificate</a>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-4">Nothing is added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

export function EducationDisplay({ education }: { education: Client<Education>[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Education</CardTitle>
                <CardDescription>Your academic background.</CardDescription>
            </CardHeader>
            <CardContent>
                {education.length > 0 ? (
                    <div className="space-y-4">
                        {education.map(edu => (
                            <Card key={edu._id} className="p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-grow min-w-0">
                                    <div className="relative h-12 w-12 flex-shrink-0">
                                        {edu.icon && stringToIconMap[edu.icon] ? 
                                            React.createElement(stringToIconMap[edu.icon], { className: "h-10 w-10 text-primary" }) : 
                                            edu.icon ? <Image src={edu.icon} alt={edu.degreeName} fill className="object-contain rounded-md" /> :
                                            <div className="h-10 w-10 bg-muted rounded-md" />
                                        }
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-medium truncate">{edu.degreeName}</p>
                                        <p className="text-sm text-muted-foreground truncate">{edu.collegeName}</p>
                                        <p className="text-xs text-muted-foreground">{edu.period} | CGPA: {edu.cgpa}</p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex items-center">
                                    <EditEducationDialog educationItem={edu} />
                                    <DeleteItemDialog action={deleteEducation} itemId={edu._id!} itemName={edu.degreeName}>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </DeleteItemDialog>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                     <p className="text-muted-foreground text-center py-4">Nothing is added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

export function WorkExperienceDisplay({ workExperience }: { workExperience: Client<WorkExperience>[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Work Experience</CardTitle>
                <CardDescription>Your professional experience.</CardDescription>
            </CardHeader>
            <CardContent>
                {workExperience.length > 0 ? (
                    <div className="space-y-4">
                        {workExperience.map(exp => (
                            <Card key={exp._id} className="p-4 flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-grow min-w-0">
                                    <div className="relative h-12 w-12 flex-shrink-0">
                                       {exp.icon && stringToIconMap[exp.icon] ? 
                                            React.createElement(stringToIconMap[exp.icon], { className: "h-10 w-10 text-primary" }) : 
                                            exp.icon ? <Image src={exp.icon} alt={exp.companyName} fill className="object-contain rounded-md" /> :
                                            <div className="h-10 w-10 bg-muted rounded-md" />
                                        }
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-medium">{exp.role}</p>
                                        <p className="text-sm text-muted-foreground">{exp.companyName}</p>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            <SlateViewer value={exp.description} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex items-center">
                                    <EditWorkExperienceDialog experience={exp} />
                                    <DeleteItemDialog action={deleteWorkExperience} itemId={exp._id!} itemName={exp.role}>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </DeleteItemDialog>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-4">Nothing is added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

export function ProfileLinksDisplay({ profileLinks }: { profileLinks: Client<ProfileLink>[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Profile Links</CardTitle>
                <CardDescription>Your social and professional links.</CardDescription>
            </CardHeader>
            <CardContent>
                {profileLinks.length > 0 ? (
                    <div className="space-y-4">
                        {profileLinks.map(link => (
                            <Card key={link._id} className="p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-grow min-w-0">
                                    <div className="relative h-12 w-12 flex-shrink-0">
                                        {link.icon && stringToIconMap[link.icon] ? 
                                            React.createElement(stringToIconMap[link.icon], { className: "h-10 w-10 text-primary" }) : 
                                            link.icon ? <Image src={link.icon} alt={link.platform} fill className="object-contain rounded-md" /> :
                                            <div className="h-10 w-10 bg-muted rounded-md" />
                                        }
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-medium truncate">{link.platform}</p>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary break-all">{link.url}</a>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex items-center">
                                    <EditProfileLinkDialog link={link} />
                                    <DeleteItemDialog action={deleteProfileLink} itemId={link._id!} itemName={link.platform}>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </DeleteItemDialog>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-4">Nothing is added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

    

    



    
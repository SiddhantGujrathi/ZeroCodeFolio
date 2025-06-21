import { Award, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAchievementsCollection } from "@/models/Achievement";
import { getCertificationsCollection } from "@/models/Certification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Button } from "../ui/button";


export async function Achievements() {
  const achievementsCollection = await getAchievementsCollection();
  const achievements = await achievementsCollection.find({}).sort({ _id: -1 }).toArray();

  const certificationsCollection = await getCertificationsCollection();
  const certifications = await certificationsCollection.find({}).sort({ _id: -1 }).toArray();

  if (achievements.length === 0 && certifications.length === 0) {
    return null;
  }

  return (
    <section id="achievements" className="bg-muted/50 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Achievements & Certifications
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A few of my proudest accomplishments and credentials.
          </p>
        </div>
        <Tabs defaultValue="achievements" className="w-full mt-12">
            <TabsList className="grid w-full grid-cols-2 mx-auto max-w-sm">
                <TabsTrigger value="achievements" disabled={achievements.length === 0}>Achievements</TabsTrigger>
                <TabsTrigger value="certifications" disabled={certifications.length === 0}>Certifications</TabsTrigger>
            </TabsList>
            <TabsContent value="achievements">
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievement) => (
                    <Card key={achievement._id.toString()}>
                       <CardHeader>
                            <div className="aspect-video relative border rounded-md overflow-hidden">
                                <Image src={achievement.image || 'https://placehold.co/600x400.png'} alt={achievement.title} fill className="object-cover" data-ai-hint={achievement.imageAiHint || 'award'} />
                            </div>
                       </CardHeader>
                       <CardContent>
                           <CardTitle className="text-lg">{achievement.title}</CardTitle>
                           <CardDescription className="mt-1 text-sm">{achievement.description}</CardDescription>
                       </CardContent>
                    </Card>
                ))}
                </div>
            </TabsContent>
            <TabsContent value="certifications">
                 <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 {certifications.map((cert) => (
                    <Card key={cert._id.toString()} className="flex flex-col">
                       <CardHeader className="flex-1">
                            <div className="aspect-video relative border rounded-md overflow-hidden">
                                <Image src={cert.image || 'https://placehold.co/600x400.png'} alt={cert.title} fill className="object-cover" data-ai-hint={cert.imageAiHint || 'certificate'} />
                            </div>
                       </CardHeader>
                       <CardContent className="flex-1">
                           <CardTitle className="text-lg">{cert.title}</CardTitle>
                           <CardDescription className="mt-1 text-sm">{cert.issuedBy} - {new Date(cert.date).toLocaleDateString()}</CardDescription>
                       </CardContent>
                       {cert.certificateUrl && (
                        <div className="p-6 pt-0">
                           <Button asChild className="w-full">
                               <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">View Certificate</a>
                           </Button>
                        </div>
                       )}
                    </Card>
                ))}
                </div>
            </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

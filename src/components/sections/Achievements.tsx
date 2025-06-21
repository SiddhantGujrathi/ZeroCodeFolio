import { Award, CheckCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAchievementsCollection } from "@/models/Achievement";
import { getCertificationsCollection } from "@/models/Certification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Button } from "../ui/button";
import { SlateViewer } from "../admin/SlateViewer";


export async function Achievements() {
  const achievementsCollection = await getAchievementsCollection();
  const achievements = await achievementsCollection.find({}).sort({ _id: -1 }).toArray();

  const certificationsCollection = await getCertificationsCollection();
  const certifications = await certificationsCollection.find({}).sort({ order: 1, _id: -1 }).toArray();

  if (achievements.length === 0 && certifications.length === 0) {
    return null;
  }

  return (
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-headline flex items-center justify-center gap-4 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="rounded-lg bg-primary/10 p-3 text-primary">
            <Award className="h-6 w-6" />
          </span>
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
                  <Card key={achievement._id.toString()} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                     <CardHeader>
                          <div className="aspect-video relative border rounded-md overflow-hidden">
                              <Image src={achievement.image || 'https://placehold.co/600x400.png'} alt={achievement.title} fill className="object-cover" data-ai-hint={achievement.imageAiHint || 'award'} />
                          </div>
                     </CardHeader>
                     <CardContent>
                         <CardTitle className="text-lg">{achievement.title}</CardTitle>
                         <div className="mt-1 text-sm text-card-foreground/80">
                           <SlateViewer value={achievement.description}/>
                         </div>
                     </CardContent>
                  </Card>
              ))}
              </div>
          </TabsContent>
          <TabsContent value="certifications">
               <div className="mt-8 max-w-4xl mx-auto space-y-6">
               {certifications.map((cert) => {
                  const issueDate = new Date(cert.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                  });

                  return (
                    <Card key={cert._id.toString()} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-6">
                            <div className="flex-1 space-y-3 text-center sm:text-left">
                                <CardTitle className="text-xl">{cert.title}</CardTitle>
                                <CardDescription>Issued by: {cert.issuedBy}</CardDescription>
                                <p className="text-sm text-muted-foreground">Date of Issue: {issueDate}</p>
                                {cert.certificateUrl && (
                                    <Button asChild variant="outline" size="sm" className="mt-2">
                                        <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                                            View Certification
                                            <ExternalLink />
                                        </a>
                                    </Button>
                                )}
                            </div>
                            <div className="relative h-24 w-24 flex-shrink-0">
                                <Image
                                    src={cert.image || 'https://placehold.co/150x150.png'}
                                    alt={cert.title}
                                    fill
                                    className="object-contain rounded-md"
                                    data-ai-hint={cert.imageAiHint || 'certificate logo'}
                                />
                            </div>
                        </div>
                    </Card>
                  );
                })}
              </div>
          </TabsContent>
      </Tabs>
    </div>
  );
}

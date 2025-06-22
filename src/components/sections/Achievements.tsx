// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
import { Award, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAchievementsCollection } from "@/models/Achievement";
import { getCertificationsCollection } from "@/models/Certification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Button } from "../ui/button";
import { SlateViewer } from "../admin/SlateViewer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";


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
             {achievements.length > 0 && (
                <Carousel
                  opts={{ align: "start", loop: true }}
                  autoplay
                  className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto mt-8"
                >
                  <CarouselContent>
                    {achievements.map((achievement) => (
                      <CarouselItem key={achievement._id.toString()} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                          <Card className="transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                            <CardHeader>
                              <div className="aspect-video relative border rounded-md overflow-hidden">
                                <Image src={(achievement.image && typeof achievement.image === 'string') ? achievement.image : 'https://placehold.co/600x400.png'} alt={achievement.title} fill className="object-cover" data-ai-hint={achievement.imageAiHint || 'award'} />
                              </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                              <CardTitle className="text-lg">{achievement.title}</CardTitle>
                              <div className="mt-1 text-sm text-card-foreground/80">
                                <SlateViewer value={achievement.description}/>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
             )}
          </TabsContent>
          <TabsContent value="certifications">
               {certifications.length > 0 && (
                <Carousel
                  opts={{ align: "start", loop: true }}
                  autoplay
                  className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto mt-8"
                >
                  <CarouselContent>
                    {certifications.map((cert) => {
                      const issueDate = new Date(cert.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                      });

                      return (
                        <CarouselItem key={cert._id.toString()}>
                           <div className="p-1 h-full">
                            <Card className="transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                                <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-6 flex-grow">
                                    <div className="flex-1 space-y-3 text-center sm:text-left">
                                        <CardTitle className="text-xl">{cert.title}</CardTitle>
                                        <CardDescription>Issued by: {cert.issuedBy}</CardDescription>
                                        <p className="text-sm text-muted-foreground">Date of Issue: {issueDate}</p>
                                        {cert.certificateUrl && (
                                            <Button asChild variant="outline" size="sm" className="mt-2">
                                                <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                                                    View Certification
                                                    <ExternalLink className="ml-2 h-4 w-4" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                    <div className="relative h-24 w-24 flex-shrink-0">
                                        <Image
                                            src={(cert.image && typeof cert.image === 'string') ? cert.image : 'https://placehold.co/150x150.png'}
                                            alt={cert.title}
                                            fill
                                            className="object-contain rounded-md"
                                            data-ai-hint={cert.imageAiHint || 'certificate logo'}
                                        />
                                    </div>
                                </div>
                            </Card>
                           </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}
          </TabsContent>
      </Tabs>
    </div>
  );
}

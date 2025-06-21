import { Award } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAchievementsCollection } from "@/models/Achievement";

export async function Achievements() {
  const achievementsCollection = await getAchievementsCollection();
  const achievements = await achievementsCollection.find({}).sort({ _id: -1 }).toArray();

  if (achievements.length === 0) {
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
            A few of my proudest accomplishments.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <Card key={achievement._id.toString()} className="flex items-center">
              <CardHeader className="flex items-center justify-center p-4">
                  <Award className="h-8 w-8 text-accent" />
              </CardHeader>
              <CardContent className="p-4 pt-4">
                  <h3 className="font-headline text-lg font-semibold">{achievement.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{achievement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

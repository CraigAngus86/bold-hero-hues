
import React from 'react';
import { FeaturedArticle } from '@/types/news';

// Featured articles data
const featuredArticles: FeaturedArticle[] = [
  {
    id: '1',
    title: 'Match Preview: Highland League Showdown',
    image_url: '/placeholder-image.jpg',
    category: 'News',
    publish_date: new Date().toISOString(),
    excerpt: 'This weekend sees a crucial match in the Highland League...'
  },
  {
    id: '2',
    title: 'New Player Signing Announcement',
    image_url: '/placeholder-image.jpg',
    category: 'News',
    publish_date: new Date().toISOString(),
    excerpt: 'We are delighted to announce our newest player signing...'
  }
];

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function IndexPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Highland League App</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Featured News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.category} - {new Date(item.publish_date).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover mb-4 rounded" />
                <p>{item.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button>Read More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Fixtures</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Home Team</TableHead>
              <TableHead>Away Team</TableHead>
              <TableHead>Venue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2023-09-16</TableCell>
              <TableCell>Buckie Thistle</TableCell>
              <TableCell>Inverness Caledonian</TableCell>
              <TableCell>Victoria Park</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2023-09-23</TableCell>
              <TableCell>Nairn County</TableCell>
              <TableCell>Clachnacuddin</TableCell>
              <TableCell>Station Park</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">League Standings</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Brechin City</TableCell>
              <TableCell>9</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>Buckie Thistle</TableCell>
              <TableCell>7</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

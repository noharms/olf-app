import { Component, OnInit } from '@angular/core';

interface TeamMember {
  name: string;
  position: string;
  image: string;
  bio: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  teamMembers: TeamMember[] = [
    {
      name: 'Niclas Moldenhauer',
      position: 'CEO & Co-Founder',
      image: 'assets/team/niclas.jpg', // Update with the actual image path
      bio: 'Niclas has over 20 years of experience in leading tech companies and is passionate about applying technology to solve real-world problems.'
    },
    {
      name: 'Moritz Feyerabend',
      position: 'CTO & Co-Founder',
      image: 'assets/team/moritz.jpg', // Update with the actual image path
      bio: 'Moritz is an expert in software architecture and has been the technical backbone of our projects since day one.'
    },
    {
      name: 'Enno Harms',
      position: 'COO & Co-Founder',
      image: 'assets/team/enno.jpg', // Update with the actual image path
      bio: 'Enno specializes in operations and has a deep understanding of how to scale tech businesses efficiently.'
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}

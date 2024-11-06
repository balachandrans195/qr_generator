import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-detail-view',
  templateUrl: './student-detail-view.component.html',
  styleUrls: ['./student-detail-view.component.css']
})
export class StudentDetailViewComponent implements OnInit {
  studentData: any = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.studentData = {
        name: params['name'],
        register_number: params['register_number'],
        college_name: params['college_name'],
        university: params['university'],
        department_name: params['department_name'],
        semester: params['semester'],
        subjects: JSON.parse(params['subjects'])
      };
    });
  }
}

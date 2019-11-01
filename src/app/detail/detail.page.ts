import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  GITHUB_USER,
  GITHUB_MARKDOWN_REPO,
  GITHUB_MARKDOWN_REPO_DEFAULT_BR
} from './../constants';

@Component({
  selector: 'app-detail',
  templateUrl: 'detail.page.html',
  styleUrls: ['detail.page.scss']
})
export class DetailPage implements OnInit {
  public path: string;
  public id: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const user = GITHUB_USER;
    const repo = GITHUB_MARKDOWN_REPO;
    const branch = GITHUB_MARKDOWN_REPO_DEFAULT_BR;
    this.route.params.subscribe(params => {
      let id = params.id;
      this.id = id;
      this.path = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${id}`;
    });

    // let github = new GitHub();
    // let repo = github.getRepo('l10178', 'little-jelly-bean-pieces');
    // let filePath = 'README.md';
    // repo.getContents('master', filePath, true).then(response => {
    //   this.content = response.data;
    // });
  }
}

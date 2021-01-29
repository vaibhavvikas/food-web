import { Component, OnInit } from '@angular/core';
import { RestServiceService } from '../../services/rest-service.service';
import { Nodes } from '../../interfaces/nodes';
import { Connections } from '../../interfaces/connections';
import { MatDialog } from '@angular/material/dialog';
import { ForceGraphComponent } from '../force-graph/force-graph.component';


@Component({
  selector: 'app-foodwebhome',
  templateUrl: './foodwebhome.component.html',
  styleUrls: ['./foodwebhome.component.css']
})
export class FoodwebhomeComponent implements OnInit {

  nodes: Nodes[];
  links: Connections[];
  selectedValue: string;

  constructor(private restService: RestServiceService, public dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.loadNodes();
    this.loadConnections();
  }

  loadNodes() {
    this.restService.getNodes().subscribe(
      data => {
        this.nodes = data;
      })
  }

  loadConnections() {
    this.restService.getConnections().subscribe(
      data => {
        this.links = data;
      })
  }

  openDialog() {
    const dialogRef = this.dialog.open(ForceGraphComponent, {
      data: { nodes: this.nodes, links: this.links}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

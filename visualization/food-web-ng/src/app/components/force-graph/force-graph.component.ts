import { Component, OnInit, ViewEncapsulation, AfterViewInit, HostListener, Inject } from '@angular/core';
import { RestServiceService } from '../../services/rest-service.service';
import { Nodes } from '../../interfaces/nodes';
import { Connections } from '../../interfaces/connections';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FoodwebhomeComponent } from '../foodwebhome/foodwebhome.component'
import * as d3 from 'd3';
import * as d4 from 'd3-labeler';

@Component({
  selector: 'app-force-graph',
  templateUrl: './force-graph.component.html',
  styleUrls: ['./force-graph.component.css'],
})
export class ForceGraphComponent implements OnInit {

  constructor(private restService: RestServiceService, public graphRef: MatDialogRef<FoodwebhomeComponent>, @Inject(MAT_DIALOG_DATA) public data: {nodes: Nodes[], links: Connections[]} ) {
    this.getScreenSize();
   }

  nodes: Nodes[];
  links: Connections[];
  screenWidth: number;
  screenHeight: number;
  radius: number;
  isValid = false;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight*0.75;
    this.screenWidth = window.innerWidth*0.75;
    if(this.screenWidth > 900){
      this.radius = 50;
    } else if (this.screenWidth > 500 ){
      this.radius = 100;
    } else {
      this.radius = 150;
    }
  }

  ngOnInit(): void {
    this.nodes = this.data.nodes;
    this.links = this.data.links;
    this.loadForceDirectedGraph();
  }

  loadForceDirectedGraph(){
    const svg = d3.select('svg');
    var width = this.screenWidth
    var height = this.screenHeight
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg
    .attr("width", width)
    .attr("height", height);
    
    function updateWindow(){
      width = window.innerWidth * 0.75;
      height = window.innerHeight * 0.75;
      svg.attr("width", width).attr("height", height);
      simulation.force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width/2))
      .force('y',  d3.forceY(height/2));
    }

    window.onresize = updateWindow;

    var radius = this.radius;
    this.nodes.forEach(d => { d.radius = radius })
    const link2 = this.links.map(d => Object.create(d));
    const node2 = this.nodes.map(d => Object.create(d));

    var simulation = d3.forceSimulation(node2)
      .force('x', d3.forceX(width))
      .force('y',  d3.forceY(height))
      .force('link', d3.forceLink(link2).id((d) => d['id']).distance(140).strength(1))
      .force('charge', d3.forceManyBody().strength(-1050))
      .force('center', d3.forceCenter(width / 2, height / 2));

    svg.append("defs").append("marker")
      .attr("id", 'end-arrow')
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("markerWidth", 3)
      .attr("markerHeight", 3)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", color)
      .attr("d", "M0,-5L10,0L0,5");

    const link = svg.append("g")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(link2)
      .join("path")
      .attr("stroke-width", d => 2)
      .attr("marker-end", "url(#end-arrow)");

    const node = svg.append("g")
      .attr("fill", "#000")
      .selectAll("g")
      .data(node2)
      .join("g")
      .attr("fill",  d => color(d.trophic_level))
      .call(this.drag(simulation));

    node.append("circle")
      .attr("id", d => d.id)
      .attr("stroke", "#999")
      .attr("stroke-width", 1)
      .attr("r", d => Math.sqrt(d.count/this.radius) + 4);

    node.append("text")
      .attr("x", d => { return Math.sqrt(d.count/this.radius) + 7; })
      .attr("y", "0.31em")
      .text(d => d.id)
      .clone(true).lower()
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 3);

    console.log(document.getElementById("Plants"))

    simulation.on("tick", () => {
      link.attr("d", this.linkArc);
      node.attr("transform", d => { 
        d.x = Math.max(Math.sqrt((d.count)/this.radius) + 4, Math.min(width - Math.sqrt((d.count)/this.radius) - 4, d.x));
        d.y = Math.max(Math.sqrt((d.count)/this.radius) + 4, Math.min(height - Math.sqrt((d.count)/this.radius) - 4, d.y));
        return `translate(${d.x}, ${d.y})`});
    });
  }

  linkArc(d: { source: { x: number; y: number; count: any; radius: any }; target: { x: number; y: number; count: any; radius: any; }; }) {
    var sourceX = d.source.x;
    var sourceY = d.source.y;
    var targetX = d.target.x;
    var targetY = d.target.y;

    var theta = Math.atan((targetX - sourceX) / (targetY - sourceY));
    var phi = Math.atan((targetY - sourceY) / (targetX - sourceX));

    var sinTheta = (Math.sqrt((d.source.count)/d.source.radius) + 4) * Math.sin(theta);
    var cosTheta = (Math.sqrt((d.source.count)/d.source.radius) + 4) * Math.cos(theta);
    var sinPhi = (Math.sqrt((d.target.count)/d.target.radius) + 4) * Math.sin(phi);
    var cosPhi = (Math.sqrt((d.target.count)/d.target.radius) + 4) * Math.cos(phi);

    if (d.target.y > d.source.y) {
        sourceX = sourceX - sinTheta;
        sourceY = sourceY - cosTheta;
    }
    else {
        sourceX = sourceX + sinTheta;
        sourceY = sourceY + cosTheta;
    }

    if (d.source.x > d.target.x) {
        targetX = targetX + cosPhi;
        targetY = targetY + sinPhi;    
    }
    else {
        targetX = targetX - cosPhi;
        targetY = targetY - sinPhi;   
    }

    return "M" + sourceX + "," + sourceY + "L" + targetX + "," + targetY;
  }

  drag = simulation => {
  
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
}

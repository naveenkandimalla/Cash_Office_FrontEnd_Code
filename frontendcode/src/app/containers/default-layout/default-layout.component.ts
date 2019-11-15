import { Component, Input } from '@angular/core';
import { navItems } from './../../_nav';
import {TokenStorageService} from '../../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  username:any;
  constructor(private tokenstorge:TokenStorageService,private router:Router) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });


  }

  ngOnInit(){
    this.getsessionvalues();
  }
  // fetch the seassion value 
  
  getsessionvalues(){
   this.username= this.tokenstorge.getUsername()
  }
  
  logoutsession(){
    this.tokenstorge.signOut();
    this.router.navigateByUrl('/login'); 
    
  }
}

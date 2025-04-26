import {Component, ElementRef, HostListener, inject, OnInit, signal, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {filter} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import UserContext from '../../../../shared/contexts/user.context';

@Component({
  selector: 'app-user-view-header',
  imports: [
    RouterLink
  ],
  templateUrl: './user-view-header.component.html',
  styleUrl: './user-view-header.component.scss'
})
export class UserViewHeaderComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer)
  private _userCtx = inject(UserContext);

  _user = this._userCtx.user();

  @ViewChild('profileMenu', { read: ElementRef }) profileMenu!: ElementRef;
  @ViewChild('profileButton', { read: ElementRef }) profileButton!: ElementRef;
  profileMenuOpen = signal(false);

  get userRole(){
    return this._userCtx.user()?.role ?? "User";
  }

  ngOnInit(): void {
    // Set initial active link based on the current URL
    this.updateActiveLink(this.router.url);

    // Listen for route changes to update active link dynamically
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveLink(event.urlAfterRedirects);
    });

    if(this.userRole === "Admin")
      this.navigationLinks.update(v => [...v, {
        value: "Dashboard",
        isActive: false,
        route: "/admin/dashboard"
      }])
  }

  navigationLinks = signal<NavIconType[]>([
    {value: "Home", route: "/main/user/main", isActive: false},
    {value: "Category", route: "/main/user/products", isActive: false},
    {value: "Men", route:"/main/user/products", isActive: false},
    {value: "Women", route: "/main/user/products", isActive: false},
  ])

  personalIcons = signal<NavPersonalIconType[]>([
    {
      value: "shop cart",
      route: "/user/cart",
      icon: "<svg width=\"22\" height=\"22\" viewBox=\"0 0 22 22\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
        "<path d=\"M16.1499 4.87385L16.1986 5.31392L16.6413 5.31887L16.7248 5.3198V5.31983H16.7304C18.1273 5.31983 19.8962 6.18162 20.5155 8.80103L21.3986 15.2613L21.3985 15.2613L21.3997 15.2686C21.7022 17.2601 21.3143 18.7699 20.3416 19.8306C19.3673 20.8927 17.7834 21.5 15.6813 21.5H6.30431C3.96104 21.5 2.45338 20.9562 1.54628 19.9604L1.54602 19.9601C0.641304 18.9684 0.284396 17.4256 0.629196 15.255L0.629317 15.255L0.63081 15.2441L1.50048 8.86084C2.02698 6.19475 3.8935 5.31983 5.29675 5.31983H5.74266L5.79349 4.87683C5.91981 3.77585 6.44613 2.72307 7.28517 1.93237C8.25129 1.02511 9.59136 0.5 10.9628 0.5H10.9864C13.687 0.5 15.881 2.44171 16.1499 4.87385ZM2.17991 8.93008L2.17711 8.94436L2.17515 8.95878L1.3087 15.3237C1.02051 17.1553 1.21451 18.6426 2.08308 19.5955C2.93501 20.5304 4.3813 20.9075 6.30431 20.9075H15.6813C16.8796 20.9075 18.6817 20.6902 19.805 19.4637C20.7164 18.4702 20.9781 17.0429 20.7197 15.3367L19.8452 8.91523L19.842 8.89142L19.8365 8.86804C19.4331 7.1558 18.3112 5.91236 16.7304 5.91236H5.29675C4.99344 5.91236 4.34784 5.96902 3.70224 6.39162C3.04093 6.8245 2.44015 7.60192 2.17991 8.93008ZM7.78983 2.33227L7.78955 2.33253C7.10175 2.97971 6.64995 3.83198 6.50343 4.73966L6.40985 5.31932L6.99702 5.31934L14.9489 5.31963L15.5342 5.31966L15.4427 4.74149C15.1131 2.65795 13.2203 1.09253 10.983 1.09253H10.9662C9.78582 1.09253 8.63228 1.54079 7.78983 2.33227ZM14.2624 9.86819C14.4984 9.86819 14.6306 10.046 14.6306 10.1645C14.6306 10.3217 14.5091 10.4607 14.314 10.4607H14.2624C14.0465 10.4607 13.9199 10.3017 13.9199 10.1645C13.9199 10.0272 14.0465 9.86819 14.2624 9.86819ZM7.71366 9.86819C7.94971 9.86819 8.08194 10.046 8.08194 10.1645C8.08194 10.3208 7.9602 10.4607 7.76421 10.4607H7.71366C7.49784 10.4607 7.37122 10.3017 7.37122 10.1645C7.37122 10.0272 7.49784 9.86819 7.71366 9.86819Z\" fill=\"currentColor\" stroke=\"currentColor\"/>\n" +
        "</svg>\n",
      isActive : false
    },
    {
      value: "favorite",
      route: "/user/favorite",
      icon: "<svg width=\"25\" height=\"23\" viewBox=\"0 0 25 23\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
        "<g opacity=\"0.5\">\n" +
        "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M1.45022 10.6929C0.151129 6.96028 1.66936 2.69393 5.92743 1.43151C8.16725 0.766324 10.6395 1.15853 12.5016 2.44768C14.2632 1.19418 16.8262 0.770781 19.0636 1.43151C23.3217 2.69393 24.8496 6.96028 23.5517 10.6929C21.5299 16.6094 12.5016 21.1666 12.5016 21.1666C12.5016 21.1666 3.53991 16.6785 1.45022 10.6929Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n" +
        "<path opacity=\"0.4\" d=\"M17.3438 5.23553C18.6392 5.62106 19.5545 6.68514 19.6647 7.93418\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n" +
        "</g>\n" +
        "</svg>\n",
      isActive : false
    },
    {
      value: "profile page",
      route: "/main/profile",
      icon: "<svg width=\"20\" height=\"24\" viewBox=\"0 0 20 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
        "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M9.57018 15.7051C4.94779 15.7051 1 16.348 1 18.9244C1 21.5007 4.92374 22.1669 9.57018 22.1669C14.1938 22.1669 18.1404 21.5228 18.1404 18.9476C18.1404 16.3724 14.2178 15.7051 9.57018 15.7051Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n" +
        "<path opacity=\"0.4\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M9.56999 12.0304C12.6039 12.0304 15.063 9.76724 15.063 6.97514C15.063 4.18304 12.6039 1.91992 9.56999 1.91992C6.5373 1.91992 4.07816 4.18304 4.07816 6.97514C4.06737 9.75728 6.50844 12.0204 9.53271 12.0304H9.56999Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n" +
        "</svg>\n",
      isActive : false
    }
  ])

  toggleProfileMenu(event: MouseEvent) {
    event.stopPropagation();
    this.profileMenuOpen.update(open => !open);
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (this.profileMenuOpen() &&
      this.profileMenu && this.profileButton &&
      !this.profileMenu.nativeElement.contains(target) &&
      !this.profileButton.nativeElement.contains(target)) {
      this.profileMenuOpen.set(false);
    }
  }

  logout() {
    this._userCtx.changeUserDetails(null);
    this.router.navigate(['auth', 'login']);
  }


  private updateActiveLink(url: string): void {
    this.navigationLinks.update(links => {
      return links.map(link => ({
        ...link,
        isActive: link.route ? url.startsWith(link.route) : false
      }));
    });
    this.personalIcons.update(links => {
      return links.map(link => ({
        ...link,
        isActive: link.route ? url.startsWith(link.route) : false
      }));
    });
  }

  search(value: string) {

  }

  sanitize(icon: string) {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }
}

type NavPersonalIconType = {
  value: string;
  route: string;
  icon: string;
  isActive: boolean;
}
type NavIconType = {
  value: string;
  route: string;
  isActive: boolean;
}

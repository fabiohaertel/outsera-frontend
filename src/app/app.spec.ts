import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';

@Component({ template: '<p>dashboard page</p>' })
class DashboardStub {}

@Component({ template: '<p>list page</p>' })
class ListStub {}

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          { path: 'dashboard', component: DashboardStub },
          { path: 'list', component: ListStub },
        ]),
      ],
    });
  });

  function menuLinks(root: HTMLElement): HTMLAnchorElement[] {
    return Array.from(root.querySelectorAll('nav[aria-label="Main menu"] a'));
  }

  it('renders the header and a menu with links to both views', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;

    expect(root.querySelector('header')?.textContent).toContain('Frontend Angular Test');
    expect(
      menuLinks(root).map((link) => [link.textContent?.trim(), link.getAttribute('href')]),
    ).toEqual([
      ['Dashboard', '/dashboard'],
      ['List', '/list'],
    ]);
  });

  it('navigates to the view of the clicked link and highlights it', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const [dashboardLink, listLink] = menuLinks(root);

    listLink.click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/list');
    expect(root.querySelector('main')?.textContent).toContain('list page');
    expect(listLink.classList).toContain('active');
    expect(listLink.getAttribute('aria-current')).toBe('page');
    expect(dashboardLink.classList).not.toContain('active');
  });
});

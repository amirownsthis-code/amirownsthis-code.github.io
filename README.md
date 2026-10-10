# Muhammad Amir — Portfolio

A buildless English portfolio for frontend development and data work, prepared for free GitHub Pages hosting.

## Included

- A stationery-photo hero background with a soft yellow overlay.
- A navbar that blends into the hero and turns white when scrolling.
- Animated typing with a cursor, eased section scrolling and a floating back-to-top button.
- Staggered scroll reveals, service hover fills, project-image zoom and tool hover effects.
- Separate About, Education, Skills, Projects, Services and Contact sections.
- Locally included Montserrat fonts in regular, medium, semibold, bold and extra-bold weights.
- Supplied transparent portrait and laptop image, optimized as WebP.
- Six frontend projects with local screenshots, GitHub links and project details.
- All / Frontend Development / Data Science filters.
- An intentionally empty Data Science category with a "Projects coming soon" message.
- Shareable category links, keyboard-friendly buttons, mobile navigation and reduced-motion support.
- Real email, LinkedIn and GitHub contact links. The copy-email button has a manual-copy fallback.
- Honest academic/prototype context and project contribution descriptions.

The original DevFolio code, bundled photographs and vendor libraries are not included. This is an original implementation inspired by its portfolio structure. There is no npm install, compilation step, login system, payment service or contact-form backend.

## Preview on Windows

Extract the ZIP first. Open the extracted `amir-portfolio` folder, where `index.html` lives.

You can double-click `index.html` for a quick preview. For a normal localhost preview, open PowerShell in that folder and run:

```powershell
py -3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000/**. Leave this terminal open; stop it with **Ctrl+C**.

If the `py` launcher is unavailable but Python is installed, use:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

VS Code Live Server is another option. No Node.js environment is required.

## Publish free on GitHub Pages

1. Create a **public** repository named **amirownsthis-code.github.io**. If you already have that repository, update it rather than creating a duplicate.
2. For a new repository, leave GitHub's "Add a README", license and `.gitignore` initialization options unchecked: this folder already contains project files.
3. Push the **contents** of this folder. `index.html` must be at the repository root, not inside another `amir-portfolio` directory.

For a fresh local folder and a new empty repository:

```powershell
git init -b main
git add .
git commit -m "Add personal portfolio"
git remote add origin https://github.com/amirownsthis-code/amirownsthis-code.github.io.git
git -c http.version=HTTP/1.1 push -u origin main
```

4. Open the repository's **Settings → Pages**.
5. Set **Source: Deploy from a branch**, **Branch: main**, **Folder: /(root)**, then **Save**.
6. Check the deployment result and open **https://amirownsthis-code.github.io/** once published.

GitHub Pages documentation:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

`.nojekyll` is supplied. This website uses relative local asset paths, so ordinary pages also work under a project repository path. The homepage social metadata and `404.html` assume the recommended user-site URL above; update those URLs if you choose another address.

## Update the website later

Edit and save your files, then:

```powershell
git add .
git commit -m "Update portfolio"
git push
```

Publishing from the configured branch updates the site after a successful deployment.

## Add a project

1. Put the screenshot in `assets/images/projects/`. WebP, PNG and JPEG are supported.
2. Open `assets/js/projects.js`.
3. Duplicate an existing project object inside `window.PORTFOLIO_PROJECTS`.
4. Give it a unique `id`, set `category` to `"web"` or `"data"`, and replace all content with actual project information.
5. Keep every field in the existing object: title, type, label, summary, image, alt, repository, tags, role, context, problem, contribution, features, stack and note.
6. Keep commas between the objects. Refresh the local page, check the filter and open the project's detail page.
7. Commit and push.

The cards, counts and project detail page read the same list automatically. You do not need to create a new HTML file or install a build tool.

Example shareable URLs after deployment:

- Frontend: `https://amirownsthis-code.github.io/?category=web#projects`
- Data: `https://amirownsthis-code.github.io/?category=data#projects`
- A project: `https://amirownsthis-code.github.io/project.html?id=venue360`

## Main files

| File | Purpose |
| --- | --- |
| `index.html` | Main content and homepage sections |
| `project.html` | Project detail page; selects a project by its `id` query parameter |
| `404.html` | GitHub Pages missing-page screen |
| `assets/css/style.css` | Theme, layout, responsive rules and animations |
| `assets/js/projects.js` | Project records; edit here to add future work |
| `assets/js/main.js` | Rendering, filters, URL state, menu, reveal effects and email copying |
| `assets/images/` | Supplied imagery, favicon and share image |
| `assets/images/projects/` | Local optimized screenshots from project repositories |
| `check-assets.ps1` | Read-only local asset and filename-capitalization check |

## Before publishing

Review the actual site at desktop and phone widths. In particular:

- Open all three filters; Data Science should be empty until actual data projects are added.
- Open every project, test its GitHub link and return to the portfolio.
- Test the mobile menu, keyboard focus and reduced-motion setting.
- Confirm the navbar changes on scroll, the typing cycles between accurate roles, and the floating up button appears.
- Check that section navigation scrolls smoothly and that wheel/touch input can interrupt it.
- Confirm both portraits and the background render with the intended composition.
- Test email copying over localhost or HTTPS. Local-file clipboard permission may be unavailable; the fallback displays the address.
- A mail link opens the visitor's configured email application; it does not submit a web form.

JavaScript syntax, project content, local assets and DOM behavior were checked while preparing the ZIP. Full browser rendering and real mobile-device testing were not completed in this environment.

## Content and asset notes

Project descriptions are based on Muhammad Amir's supplied information and the repositories' current READMEs. Screenshots were obtained from the same repositories. CareerIn is excluded.

The top-up projects are independent learning prototypes; real payments and currency delivery are not offered. The portfolio describes original UI directions, reference recreations and AI-assisted work separately.

The three personal/hero images were supplied by the user and optimized without changing their composition. Third-party brands and artwork visible within project screenshots belong to their respective owners. This ZIP does not grant a separate license to redistribute those third-party assets.

Montserrat is self-hosted from Google Fonts. Its SIL Open Font License is included in assets/fonts/OFL.txt.

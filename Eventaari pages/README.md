- `index.html` - the main HTML file for the landing page.
- `events.html` - separate Events page.
- `community.html` - separate Community page.
- `housing.html` - separate Housing page.
- `partners.html` - separate Partners page.
- `styles.css` - the stylesheet that controls the page layout and design.
- `script.js` - offline JavaScript for mobile navigation, event filtering, calendar, create-event demo, challenges, badges and leaderboard placeholders.
- `Readme.md` - this project overview file.
- `assets/` - image files used by the page. Mostly placeholders!
  - `eventaari-logo.png` - the Eventaari logo.
  - `Map.png` - a map image.
  - `profile-picture.png` - a profile image.

## Notes
- Profile image placeholders for the fake leaderboard users are in `script.js`. Add real image files into `assets/` and update the `profileImage` field.


## Latest update

- Community badge cards, leaderboard rows and challenge cards were made more compact.
- Completing a challenge now animates the shared XP bar with a sparkle effect.
- The landing page map image can be dragged and zoomed as an offline map-preview demo. This is not a real map API yet.
- Community achievement names and goals were updated to feel closer to Finnish student overall patches / haalarimerkit.
- The profile popup bug was fixed by removing broken JavaScript references and using the existing shared level/progress data.
- Updated Partners links so they open `partners.html` instead of staying on the same page.
- Updated Housing links so they open `housing.html` instead of staying on the same page.

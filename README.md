# LocalLance

A local freelance marketplace for Australian small businesses.

NIT3274 Assessment 2, Part B: Project Implementation. Group 3.

**This website/app is for a class assignment and not for commercial purposes.**
Every person, business, job, review and payment in it is fictitious. No real payment is ever taken.

## How to open it

Unzip the folder and double-click `index.html`. Use Chrome or Edge.
There is nothing to install and no server to start. It is plain HTML, CSS and JavaScript.

All data is kept in the browser (localStorage). To start again, click **Reset demo data** in the footer.

## Demo walk-through (about 5 minutes)

There are no passwords. The **Log in** page lists ready-made accounts.

1. **Log in as a customer**: Sofia Rossi (Rossi's Cafe). The dashboard shows her jobs.
2. **Post a job**: click *Post a job*, fill in the form and submit. The job page opens.
3. **Log in as a freelancer**: Liam O'Connor. Open the new job from *Find jobs* and send a proposal. The form shows what he receives after the flat 8% fee.
4. **Log in as Sofia again**: open the job, compare proposals and click *Accept*.
5. **Pay**: click *Pay with PayPal* and confirm. The payment is held, not paid out.
6. **Log in as Liam**: open the job and click *Mark as delivered*.
7. **Log in as Sofia**: click *Approve work and release payment*, then leave a review.
8. **Hire again**: the finished job now asks *Did you like working with Liam?* Click *Send a job offer* and fill in the form. The offer is private: only Liam sees it, on his dashboard, and it never appears in *Find jobs*. Log in as Liam to reply with a price, then the same steps follow.

Jobs at every stage are already in the demo data, so any step can also be shown on its own.

Other things to show:

- **Fee-free first job**: create a new freelancer account on the **Log in** page and take a job through to payment. The fee is $0 on that job and 8% on every job after it.
- **Minimum hourly rate**: on the **Log in** page, try to create a freelancer with an hourly rate under $26.44. The site refuses it, because that is the Australian national minimum wage from 1 July 2026.
- **Map details**: on **Find freelancers**, hover a numbered pin on the map to see that freelancer's photo, distance, rating and hourly rate.
- **Phone layout**: open the site on a phone, or drag the browser window narrow. The header becomes a menu button, and every list, form and table fits the screen.

## Where the required items are

| Requirement | Where |
|---|---|
| ABN/ACN number (temporary) | Footer of every page, and the Contact us page |
| Contact Us page | `contact.html` |
| Online payment method | `checkout.html` (PayPal demonstration) |
| Marketing and promotion | Promotion banners (home, jobs, services, dashboard) and promoted freelancer listings |
| List of available services | `services.html` and the home page |
| Link to social media | Footer and the Contact us page |
| Location maps | Freelancer search map (hover a pin for details), freelancer profiles, Contact us page |
| Attractive graphics | Icons, avatars, hero panel, job progress steps, map |
| Disclaimer | Footer of every page |

## Image credits

- Home page photo: [Degraves Street, Melbourne](https://commons.wikimedia.org/wiki/File:AUS_Melbourne,_Central_Business_District,_Degraves_Street_001.jpg) by -wuppertaler, licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Cropped and toned to gray and blue.
- Profile pictures in `img/people`: sample portraits from [randomuser.me](https://randomuser.me/), used here as placeholders for fictitious people. They do not show the people named on the site.

## Files

- `index.html` and the other `.html` files: one per page.
- `css/style.css`: all styles.
- `js/data.js`: the fictitious demo data (customers, freelancers, jobs, proposals, payments, reviews, messages, promotions).
- `js/store.js`: saves and changes the data, including the whole job flow.
- `js/ui.js`: the header, footer and shared cards.
- `js/` (other files): one small script per page.

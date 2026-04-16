# IT Permission Email Template

Claude: customize this email with the user's name, company, and role. Read it back to them and let them edit before sending.

## Draft for the user:

Subject: Permission to use personal cloud accounts for a lightweight ops dashboard

---

Hi [IT contact / team name],

I'm setting up a personal operational dashboard to track my weekly priorities, team status, and a few business KPIs. It runs as a simple web app and stores data in a cloud database.

I'd like to use these services:

- **Neon** (neon.tech) — hosted PostgreSQL database, free tier, US-based servers
- **Vercel** (vercel.com) — web hosting for the dashboard, free tier, US-based CDN

This is an executive operating tool. The data is comparable to what I'd keep in a private notebook or a OneNote file, but structured for dashboard display. Specifically, it stores:

- Employee names, roles, and focus areas
- Weekly morale observations (energy and confidence ratings per person)
- Retention risk assessments
- 1:1 meeting notes and commitments
- Performance-adjacent observations (growth areas, strengths, blockers)
- Operational KPIs (claims metrics, revenue pacing, etc.)
- Strategic initiative details and investment figures

No customer-level data or financial account numbers are stored.

I understand this may require a data protection review given the employee-related content. Happy to complete any required assessment or work with Legal on this.

The accounts would be personal (in my name), with password protection enabled on the deployed site. The code is stored in a private GitHub repository under my personal account.

Could you confirm whether this usage is acceptable under our policies? If not, I can run everything locally on my Mac instead — no cloud involved.

Happy to jump on a call if you'd like to discuss.

Thanks,
[Name]
[Title]

---

## After sending

Tell the user: "Email's ready. While you wait for IT, we can keep building — everything works locally. When they respond, tell me and I'll either turn on cloud deploy or keep you local."

Save to ANSWERS.md: `it_email_sent: true, sent_to: [recipient], sent_at: [date]`

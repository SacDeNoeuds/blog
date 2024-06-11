## Consider Adding Google Site Verification (optional)

You can easily add your [Google Site Verification HTML tag](https://support.google.com/webmasters/answer/9008080#meta_tag_verification&zippy=%2Chtml-tag) in AstroPaper using environment variable. This step is optional. If you don't add the following env variable, the google-site-verification tag won't appear in the html `<head>` section.

```bash
# in your environment variable file (.env)
PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-site-verification-value
```

## Becoming production-ready

- [ ] Change public/favicon.svg
- [ ] Change head or site config, see the [doc here](./src/content/blog/how-to-configure-astropaper-theme.md)
- [ ] Add an estimated reading time, see the [doc here](./src/content/blog/how-to-add-an-estimated-reading-time.md)
- [ ] Deploy – Likely on CloudFlare.
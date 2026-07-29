export interface LegalSection {
  title: string
  body: string
}

export interface LegalDocument {
  title: string
  sections: LegalSection[]
}

export const PRIVACY_POLICY: LegalDocument = {
  title: "Privacy Policy",
  sections: [
    {
      title: "100% Client-Side & Local Storage",
      body: "Gorib Manush operates completely offline within your web browser. All your financial data is saved exclusively in your device's browser localStorage.",
    },
    {
      title: "Zero Data Harvesting",
      body: "We do not collect, track, monitor, or transmit your personal financial information to any external server or third-party database.",
    },
    {
      title: "Full Data Control & Backups",
      body: "You maintain complete ownership of your financial records. You can export a JSON backup file or clear your dataset at any time via Settings.",
    },
    {
      title: "Cookies & Trackers",
      body: "Gorib Manush does not use tracking cookies or invasive third-party ad pixels.",
    },
  ],
}

export const LEGAL_TERMS: LegalDocument = {
  title: "Legal Terms & Conditions",
  sections: [
    {
      title: "Personal & Educational Use",
      body: "Gorib Manush is provided as an intuitive personal finance organization tool to assist users in budgeting and expense tracking.",
    },
    {
      title: "Financial Disclaimer",
      body: "Insights, health scores, and payday pacing recommendations are for organizational reference only and do not constitute certified financial, tax, or investment advice.",
    },
    {
      title: "Accuracy & Responsibility",
      body: 'Users are responsible for verifying their own transaction amounts and account entries. The software is provided "as is" without warranties of any kind.',
    },
    {
      title: "Ownership & Credits",
      body: "Developed and maintained by Mehedi. All visual layouts and code components are protected.",
    },
  ],
}

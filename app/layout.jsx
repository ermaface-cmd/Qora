import './globals.css'

export const metadata = {
  title: 'Offerto',
  description: 'Preventivi e fatture professionali',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}

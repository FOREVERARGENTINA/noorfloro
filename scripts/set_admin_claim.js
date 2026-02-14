import { readFileSync } from 'fs'
import admin from 'firebase-admin'

const args = process.argv.slice(2)
const getArgValue = (flag) => {
  const index = args.indexOf(flag)
  if (index === -1 || index + 1 >= args.length) return null
  return args[index + 1]
}

const email = getArgValue('--email')
const uid = getArgValue('--uid')

if (!email && !uid) {
  console.error('Uso: node scripts/set_admin_claim.js --email user@dominio.com')
  console.error('   o: node scripts/set_admin_claim.js --uid <UID>')
  process.exit(1)
}

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS

let credential

if (serviceAccountBase64) {
  const json = Buffer.from(serviceAccountBase64, 'base64').toString('utf8')
  credential = admin.credential.cert(JSON.parse(json))
} else if (serviceAccountPath) {
  const json = readFileSync(serviceAccountPath, 'utf8')
  credential = admin.credential.cert(JSON.parse(json))
} else {
  console.error('Falta FIREBASE_SERVICE_ACCOUNT_BASE64 o GOOGLE_APPLICATION_CREDENTIALS.')
  process.exit(1)
}

if (!admin.apps.length) {
  admin.initializeApp({ credential })
}

const auth = admin.auth()

const resolveUser = async () => {
  if (uid) return auth.getUser(uid)
  return auth.getUserByEmail(email)
}

const user = await resolveUser()
await auth.setCustomUserClaims(user.uid, { admin: true, role: 'admin' })

console.log(`OK: role=admin asignado a UID ${user.uid}`)
console.log('Importante: el usuario debe cerrar sesión y volver a iniciar.')

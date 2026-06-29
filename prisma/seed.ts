import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import crypto from "crypto";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.coolingSpot.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.helpRequest.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const adminId = crypto.randomUUID();
  const hashedPwd = await hashPassword("admin123");

  await prisma.user.create({
    data: {
      id: adminId,
      name: "Admin Dax",
      email: "admin@mairie-dax.fr",
      emailVerified: true,
      role: "admin",
    },
  });

  await prisma.account.create({
    data: {
      id: crypto.randomUUID(),
      accountId: adminId,
      providerId: "credential",
      userId: adminId,
      password: hashedPwd,
    },
  });

  await prisma.coolingSpot.createMany({
    data: [
      {
        name: "Fontaine du Parc Théodore Denis",
        address: "Parc Théodore Denis, Dax",
        lat: 43.7095,
        lng: -1.0508,
        type: "fontaine",
        capacity: null,
        hours: "24h/24",
        isOpen: true,
        description: "Fontaine d'eau potable dans le parc ombragé",
      },
      {
        name: "Fontaine Chaude",
        address: "Place de la Fontaine Chaude, Dax",
        lat: 43.7107,
        lng: -1.0544,
        type: "fontaine",
        capacity: null,
        hours: "24h/24",
        isOpen: true,
        description: "Point d'eau historique au centre-ville",
      },
      {
        name: "Gymnase Municipal René Crabos",
        address: "Avenue Maurice Boyau, Dax",
        lat: 43.7062,
        lng: -1.0572,
        type: "gymnase",
        capacity: 200,
        hours: "9h-18h",
        isOpen: true,
        description: "Salle climatisée ouverte au public pendant les épisodes caniculaires",
      },
      {
        name: "Médiathèque de Dax",
        address: "2 rue des Fusillés, Dax",
        lat: 43.7118,
        lng: -1.0531,
        type: "bibliotheque",
        capacity: 120,
        hours: "10h-18h",
        isOpen: true,
        description: "Espace climatisé avec accès Wi-Fi et eau gratuite",
      },
      {
        name: "Centre Commercial Le Berceau",
        address: "Rue du Berceau, Dax",
        lat: 43.7135,
        lng: -1.0498,
        type: "commerce",
        capacity: 80,
        hours: "9h-20h",
        isOpen: false,
        description: "Commerce climatisé acceptant les personnes cherchant la fraîcheur",
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        title: "Conseils hydratation",
        message:
          "Pensez à boire au moins 1,5L d'eau par jour et à mouiller votre corps régulièrement.",
        target: "all",
        severity: "info",
        publishedAt: new Date(),
      },
      {
        title: "Vigilance orange canicule",
        message:
          "Météo-France place le département en vigilance orange. Évitez les sorties entre 12h et 16h.",
        target: "all",
        severity: "warning",
        publishedAt: new Date(Date.now() - 3600 * 1000),
      },
      {
        title: "Alerte canicule extrême",
        message:
          "Températures attendues au-dessus de 42°C. Restez chez vous, fermez les volets, et contactez vos proches isolés.",
        target: "seniors",
        severity: "critical",
        publishedAt: new Date(Date.now() - 7200 * 1000),
      },
    ],
  });

  await prisma.helpRequest.createMany({
    data: [
      {
        message: "Ma voisine de 85 ans ne répond plus depuis ce matin",
        lat: 43.7121,
        lng: -1.0515,
        status: "pending",
      },
      {
        message: "Besoin d'eau potable dans notre immeuble, coupure d'eau",
        lat: 43.7083,
        lng: -1.0562,
        status: "handled",
      },
    ],
  });

  console.log("Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

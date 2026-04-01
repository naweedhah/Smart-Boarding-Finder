import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_USERNAMES = [
  "demo_student",
  "demo_student_anu",
  "demo_student_hiruni",
  "demo_student_savindi",
  "demo_student_dulanga",
  "demo_student_kavishka",
  "demo_owner_kandy",
  "demo_owner_colombo",
  "demo_admin",
];

const imageSetA = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
];

const imageSetB = [
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
];

const imageSetC = [
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
];

async function cleanupDemoData() {
  const demoUsers = await prisma.user.findMany({
    where: { username: { in: DEMO_USERNAMES } },
    select: { id: true },
  });

  const demoUserIds = demoUsers.map((user) => user.id);

  const demoPosts = await prisma.post.findMany({
    where: { ownerId: { in: demoUserIds } },
    select: { id: true },
  });

  const demoPostIds = demoPosts.map((post) => post.id);

  const demoChats = await prisma.chat.findMany({
    where: {
      userIDs: {
        hasSome: demoUserIds,
      },
    },
    select: { id: true },
  });

  const demoChatIds = demoChats.map((chat) => chat.id);

  await prisma.message.deleteMany({
    where: { chatId: { in: demoChatIds } },
  });

  await prisma.chat.deleteMany({
    where: {
      id: { in: demoChatIds },
    },
  });

  await prisma.bookingPayment.deleteMany({
    where: {
      bookingRequestId: {
        in: (
          await prisma.bookingRequest.findMany({
            where: {
              OR: [
                { studentId: { in: demoUserIds } },
                { ownerId: { in: demoUserIds } },
                { postId: { in: demoPostIds } },
              ],
            },
            select: { id: true },
          })
        ).map((item) => item.id),
      },
    },
  });

  await prisma.bookingRequest.deleteMany({
    where: {
      OR: [
        { studentId: { in: demoUserIds } },
        { ownerId: { in: demoUserIds } },
        { postId: { in: demoPostIds } },
      ],
    },
  });

  await prisma.savedPost.deleteMany({
    where: {
      OR: [{ userId: { in: demoUserIds } }, { postId: { in: demoPostIds } }],
    },
  });

  await prisma.watchlist.deleteMany({
    where: {
      OR: [{ userId: { in: demoUserIds } }, { postId: { in: demoPostIds } }],
    },
  });

  await prisma.notification.deleteMany({
    where: { userId: { in: demoUserIds } },
  });

  await prisma.notificationPreference.deleteMany({
    where: { userId: { in: demoUserIds } },
  });

  await prisma.otpCode.deleteMany({
    where: { userId: { in: demoUserIds } },
  });

  await prisma.roommateMatch.deleteMany({
    where: {
      OR: [{ userAId: { in: demoUserIds } }, { userBId: { in: demoUserIds } }],
    },
  });

  await prisma.roommatePreference.deleteMany({
    where: { userId: { in: demoUserIds } },
  });

  await prisma.report.deleteMany({
    where: {
      OR: [{ reporterId: { in: demoUserIds } }, { postId: { in: demoPostIds } }],
    },
  });

  await prisma.complaint.deleteMany({
    where: { reporterId: { in: demoUserIds } },
  });

  await prisma.postDetail.deleteMany({
    where: { postId: { in: demoPostIds } },
  });

  await prisma.post.deleteMany({
    where: { id: { in: demoPostIds } },
  });

  await prisma.user.deleteMany({
    where: { id: { in: demoUserIds } },
  });
}

async function main() {
  await cleanupDemoData();

  const passwordHash = await bcrypt.hash("password123", 10);

  const student = await prisma.user.create({
    data: {
      username: "demo_student",
      email: "student.demo@boardingfinder.test",
      password: passwordHash,
      fullName: "Nadeesha Perera",
      phone: "0771234567",
      gender: "female",
      role: "student",
      isVerified: true,
      notificationPreference: {
        create: {
          emailEnabled: true,
          inAppEnabled: true,
          bookingUpdates: true,
          watchlistAlerts: true,
          roommateAlerts: true,
        },
      },
      roommatePreference: {
        create: {
          age: 22,
          university: "University of Peradeniya",
          faculty: "Engineering",
          yearOfStudy: "3rd Year",
          budgetMin: 18000,
          budgetMax: 30000,
          preferredCity: "Kandy",
          preferredArea: "Peradeniya",
          sleepSchedule: "Sleeps before midnight",
          cleanlinessLevel: 4,
          studyHabit: "Quiet evenings",
          smokingAllowed: false,
          petsAllowed: false,
          foodPreference: "Vegetarian-friendly",
          sociabilityLevel: 3,
          notes: "Prefers a calm study-friendly environment.",
        },
      },
    },
  });

  const ownerKandy = await prisma.user.create({
    data: {
      username: "demo_owner_kandy",
      email: "owner.kandy@boardingfinder.test",
      password: passwordHash,
      fullName: "Kumari Boarding Homes",
      phone: "0812345678",
      gender: "female",
      role: "boardingOwner",
      isVerified: true,
    },
  });

  const ownerColombo = await prisma.user.create({
    data: {
      username: "demo_owner_colombo",
      email: "owner.colombo@boardingfinder.test",
      password: passwordHash,
      fullName: "Metro Student Stays",
      phone: "0112345678",
      gender: "male",
      role: "boardingOwner",
      isVerified: true,
    },
  });

  await prisma.user.create({
    data: {
      username: "demo_admin",
      email: "admin.demo@boardingfinder.test",
      password: passwordHash,
      fullName: "Platform Admin",
      role: "admin",
      isVerified: true,
    },
  });

  const roommateStudents = await Promise.all([
    prisma.user.create({
      data: {
        username: "demo_student_anu",
        email: "anu.demo@boardingfinder.test",
        password: passwordHash,
        fullName: "Anupama Jayasinghe",
        phone: "0772345678",
        gender: "female",
        role: "student",
        isVerified: true,
        roommatePreference: {
          create: {
            age: 23,
            university: "University of Peradeniya",
            faculty: "Engineering",
            yearOfStudy: "4th Year",
            budgetMin: 20000,
            budgetMax: 32000,
            preferredCity: "Kandy",
            preferredArea: "Peradeniya",
            sleepSchedule: "Sleeps before midnight",
            cleanlinessLevel: 4,
            studyHabit: "Quiet evenings",
            smokingAllowed: false,
            petsAllowed: false,
            foodPreference: "Vegetarian-friendly",
            sociabilityLevel: 3,
            notes: "Would love a calm roommate who respects study time.",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: "demo_student_hiruni",
        email: "hiruni.demo@boardingfinder.test",
        password: passwordHash,
        fullName: "Hiruni Ekanayake",
        phone: "0773456789",
        gender: "female",
        role: "student",
        isVerified: true,
        roommatePreference: {
          create: {
            age: 21,
            university: "University of Peradeniya",
            faculty: "Science",
            yearOfStudy: "2nd Year",
            budgetMin: 17000,
            budgetMax: 26000,
            preferredCity: "Kandy",
            preferredArea: "Peradeniya",
            sleepSchedule: "Early riser",
            cleanlinessLevel: 5,
            studyHabit: "Flexible",
            smokingAllowed: false,
            petsAllowed: false,
            foodPreference: "Vegetarian-friendly",
            sociabilityLevel: 2,
            notes: "Keeps shared spaces tidy and likes quiet mornings.",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: "demo_student_savindi",
        email: "savindi.demo@boardingfinder.test",
        password: passwordHash,
        fullName: "Savindi Maduranga",
        phone: "0774567890",
        gender: "female",
        role: "student",
        isVerified: true,
        roommatePreference: {
          create: {
            age: 22,
            university: "Kandy Technical College",
            faculty: "Information Technology",
            yearOfStudy: "Final Year",
            budgetMin: 22000,
            budgetMax: 34000,
            preferredCity: "Kandy",
            preferredArea: "Hantana",
            sleepSchedule: "Late sleeper",
            cleanlinessLevel: 3,
            studyHabit: "Group study",
            smokingAllowed: false,
            petsAllowed: true,
            foodPreference: "Flexible",
            sociabilityLevel: 5,
            notes: "More social and flexible, but still careful with budget.",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: "demo_student_dulanga",
        email: "dulanga.demo@boardingfinder.test",
        password: passwordHash,
        fullName: "Dulanga Fernando",
        phone: "0775678901",
        gender: "female",
        role: "student",
        isVerified: true,
        roommatePreference: {
          create: {
            age: 24,
            university: "University of Peradeniya",
            faculty: "Arts",
            yearOfStudy: "Graduate",
            budgetMin: 15000,
            budgetMax: 23000,
            preferredCity: "Kandy",
            preferredArea: "Gelioya",
            sleepSchedule: "Sleeps before midnight",
            cleanlinessLevel: 4,
            studyHabit: "Quiet evenings",
            smokingAllowed: false,
            petsAllowed: false,
            foodPreference: "Flexible",
            sociabilityLevel: 2,
            notes: "Quiet and independent, prefers a simple routine.",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: "demo_student_kavishka",
        email: "kavishka.demo@boardingfinder.test",
        password: passwordHash,
        fullName: "Kavishka Senanayake",
        phone: "0776789012",
        gender: "male",
        role: "student",
        isVerified: true,
        roommatePreference: {
          create: {
            age: 23,
            university: "University of Peradeniya",
            faculty: "Engineering",
            yearOfStudy: "3rd Year",
            budgetMin: 18000,
            budgetMax: 28000,
            preferredCity: "Kandy",
            preferredArea: "Peradeniya",
            sleepSchedule: "Sleeps before midnight",
            cleanlinessLevel: 4,
            studyHabit: "Quiet evenings",
            smokingAllowed: false,
            petsAllowed: false,
            foodPreference: "Vegetarian-friendly",
            sociabilityLevel: 3,
            notes: "Included to verify the same-gender filter.",
          },
        },
      },
    }),
  ]);

  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: "Girls Boarding Near UOP Engineering Faculty",
        rent: 22000,
        images: imageSetA,
        address: "12 Temple Road",
        city: "Kandy",
        area: "Peradeniya",
        latitude: "7.2552",
        longitude: "80.5970",
        boardingType: "sharedRoom",
        status: "available",
        capacity: 2,
        bathroomCount: 1,
        preferredTenantGender: "female",
        ownerId: ownerKandy.id,
        postDetail: {
          create: {
            description:
              "<p>Comfortable shared boarding with study desks, balcony access, and a short walk to campus.</p>",
            wifi: true,
            mealsProvided: true,
            kitchenAccess: true,
            parking: false,
            attachedBathroom: false,
            furnished: true,
            petAllowed: false,
            nearestCampus: "University of Peradeniya",
            distanceToCampus: 650,
            distanceToBusStop: 180,
            distanceToTown: 2400,
            rules: "Quiet hours after 10 PM. Female students only.",
          },
        },
      },
    }),
    prisma.post.create({
      data: {
        title: "Single Annex Room for Female Student",
        rent: 30000,
        images: imageSetB,
        address: "89 Hantana Road",
        city: "Kandy",
        area: "Hantana",
        latitude: "7.2849",
        longitude: "80.6350",
        boardingType: "annex",
        status: "available",
        capacity: 1,
        bathroomCount: 1,
        preferredTenantGender: "female",
        ownerId: ownerKandy.id,
        postDetail: {
          create: {
            description:
              "<p>Private annex room with attached bathroom, reliable Wi-Fi, and peaceful surroundings ideal for study.</p>",
            wifi: true,
            mealsProvided: false,
            kitchenAccess: true,
            parking: true,
            attachedBathroom: true,
            furnished: true,
            petAllowed: false,
            nearestCampus: "University of Peradeniya",
            distanceToCampus: 2900,
            distanceToBusStop: 260,
            distanceToTown: 1800,
            rules: "No visitors after 8 PM. Advance notice for overnight travel.",
          },
        },
      },
    }),
    prisma.post.create({
      data: {
        title: "Budget Shared Hostel for Male Students",
        rent: 18000,
        images: imageSetC,
        address: "45 Galle Road",
        city: "Colombo",
        area: "Wellawatte",
        latitude: "6.8741",
        longitude: "79.8605",
        boardingType: "hostel",
        status: "available",
        capacity: 4,
        bathroomCount: 2,
        preferredTenantGender: "male",
        ownerId: ownerColombo.id,
        postDetail: {
          create: {
            description:
              "<p>Affordable hostel-style boarding with meals, shared study hall, and easy access to public transport.</p>",
            wifi: true,
            mealsProvided: true,
            kitchenAccess: false,
            parking: false,
            attachedBathroom: false,
            furnished: true,
            petAllowed: false,
            nearestCampus: "National School of Business Management",
            distanceToCampus: 5200,
            distanceToBusStop: 90,
            distanceToTown: 700,
            rules: "Student ID required. No smoking indoors.",
          },
        },
      },
    }),
    prisma.post.create({
      data: {
        title: "House Share with Wi-Fi and Parking",
        rent: 26000,
        images: imageSetA,
        address: "18 Lake Drive",
        city: "Colombo",
        area: "Rajagiriya",
        latitude: "6.9094",
        longitude: "79.8950",
        boardingType: "houseShare",
        status: "reserved",
        capacity: 1,
        bathroomCount: 2,
        preferredTenantGender: "any",
        ownerId: ownerColombo.id,
        postDetail: {
          create: {
            description:
              "<p>Bright room in a shared house with kitchen access, parking, and fast commuting options.</p>",
            wifi: true,
            mealsProvided: false,
            kitchenAccess: true,
            parking: true,
            attachedBathroom: false,
            furnished: true,
            petAllowed: false,
            nearestCampus: "SLIIT Metro Campus",
            distanceToCampus: 4200,
            distanceToBusStop: 140,
            distanceToTown: 1100,
            rules: "Shared chores weekly. Suitable for tidy students.",
          },
        },
      },
    }),
  ]);

  await prisma.savedPost.createMany({
    data: [
      { userId: student.id, postId: posts[0].id },
      { userId: student.id, postId: posts[1].id },
      { userId: student.id, postId: posts[3].id },
    ],
  });

  await prisma.watchlist.createMany({
    data: [
      {
        userId: student.id,
        city: "Kandy",
        area: "Peradeniya",
        minBudget: 18000,
        maxBudget: 28000,
        preferredTenantGender: "female",
        boardingType: "sharedRoom",
        minCapacity: 1,
        wifiRequired: true,
      },
      {
        userId: student.id,
        postId: posts[1].id,
        city: "Kandy",
        area: "Hantana",
        maxBudget: 32000,
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: student.id,
        type: "watchlistMatch",
        channel: "inApp",
        title: "New boarding match in Peradeniya",
        message: "A female shared room within your budget is now available.",
      },
      {
        userId: student.id,
        type: "roommateMatchFound",
        channel: "inApp",
        title: "Roommate suggestions ready",
        message: "New same-gender student profiles were added for roommate matching.",
      },
    ],
  });

  const chatA = await prisma.chat.create({
    data: {
      userIDs: [student.id, ownerKandy.id],
      seenBy: [student.id],
      lastMessage: "Yes, Wi-Fi charges are included in the monthly rent.",
    },
  });

  const chatB = await prisma.chat.create({
    data: {
      userIDs: [student.id, ownerColombo.id],
      seenBy: [],
      lastMessage: "Can I schedule a visit this Saturday morning?",
    },
  });

  await prisma.user.update({
    where: { id: student.id },
    data: {
      chatIDs: [chatA.id, chatB.id],
    },
  });

  await prisma.user.update({
    where: { id: ownerKandy.id },
    data: {
      chatIDs: [chatA.id],
    },
  });

  await prisma.user.update({
    where: { id: ownerColombo.id },
    data: {
      chatIDs: [chatB.id],
    },
  });

  await prisma.message.createMany({
    data: [
      {
        chatId: chatA.id,
        userId: student.id,
        text: "Hi, is the shared room still available for next month?",
      },
      {
        chatId: chatA.id,
        userId: ownerKandy.id,
        text: "Yes, it is available and we currently have one space left.",
      },
      {
        chatId: chatA.id,
        userId: student.id,
        text: "Are meals and Wi-Fi included?",
      },
      {
        chatId: chatA.id,
        userId: ownerKandy.id,
        text: "Yes, Wi-Fi charges are included in the monthly rent.",
      },
      {
        chatId: chatB.id,
        userId: student.id,
        text: "Can I schedule a visit this Saturday morning?",
      },
    ],
  });

  console.log("Demo boarding data seeded successfully.");
  console.log("Student login:");
  console.log("  username: demo_student");
  console.log("  password: password123");
  console.log("Extra roommate demo students:");
  console.log(
    `  ${roommateStudents
      .map((user) => user.username)
      .join(", ")} / password123`
  );
  console.log("Owner logins:");
  console.log("  username: demo_owner_kandy / password123");
  console.log("  username: demo_owner_colombo / password123");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

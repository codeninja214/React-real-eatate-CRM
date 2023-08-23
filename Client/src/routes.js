
import { Icon } from "@chakra-ui/react";
import {
  MdHome,
  MdLock, MdContacts,
  MdLeaderboard,
  MdInsertChartOutlined,
  MdOutlineMessage
} from "react-icons/md";
import { HiUsers } from "react-icons/hi";
// icon
import { AiFillFolderOpen, AiOutlineMail } from "react-icons/ai";
import { PiPhoneCallBold } from "react-icons/pi";
import { LuBuilding2 } from "react-icons/lu";
import { GiSatelliteCommunication } from "react-icons/gi";
import { FaTasks } from "react-icons/fa";
import { SiGooglemeet } from "react-icons/si";
import React from "react";

// Admin Imports
const MainDashboard = React.lazy(() => import("views/admin/default"));
const UserDashboard = React.lazy(() => import("views/admin/default"));

// My component
const Contact = React.lazy(() => import('views/admin/contact'));
const ContactView = React.lazy(() => import('views/admin/contact/View'));

const User = React.lazy(() => import("views/admin/users"));
const UserView = React.lazy(() => import("views/admin/users/View"));

const Property = React.lazy(() => import("views/admin/property"));
const PropertyView = React.lazy(() => import("views/admin/property/View"));

const Lead = React.lazy(() => import("views/admin/lead"));
const LeadView = React.lazy(() => import("views/admin/lead/View"));

const Communication = React.lazy(() => import("views/admin/communication"));

const Task = React.lazy(() => import("views/admin/task"));

const Document = React.lazy(() => import("views/admin/document"));

const EmailHistory = React.lazy(() => import("views/admin/emailHistory"));
const EmailHistoryView = React.lazy(() => import("views/admin/emailHistory/View"));

const Metting = React.lazy(() => import("views/admin/meeting"));
const MettingView = React.lazy(() => import("views/admin/meeting/View"));

const PhoneCall = React.lazy(() => import("views/admin/phoneCall"));
const PhoneCallView = React.lazy(() => import("views/admin/phoneCall/View"));

const Report = React.lazy(() => import("views/admin/reports"));

const TextMsg = React.lazy(() => import("views/admin/textMsg"));
const TextMsgView = React.lazy(() => import("views/admin/textMsg/View"));

// Auth Imports
const SignInCentered = React.lazy(() => import("views/auth/signIn"));

const routes = [
  // ========================== Dashboard ==========================
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Dasheboard",
    layout: "/user",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: UserDashboard,
  },
  // ========================== Admin Layout ==========================
  // ------------- lead Routes ------------------------
  {
    name: "Lead",
    layout: "/admin",
    both: true,
    path: "/lead",
    icon: <Icon as={MdLeaderboard} width='20px' height='20px' color='inherit' />,
    component: Lead,
  },
  {
    name: "Lead View",
    layout: "/admin",
    both: true,
    under: "lead",
    path: "/leadView/:id",
    component: LeadView,
  },
  // --------------- contact Routes --------------------
  {
    name: "Contact Info",
    layout: "/admin",
    both: true,
    path: "/contacts",
    icon: <Icon as={MdContacts} width='20px' height='20px' color='inherit' />,
    component: Contact,
  },
  {
    name: "Contact View",
    layout: "/admin",
    both: true,
    under: "contacts",
    path: "/contactView/:id",
    component: ContactView,
  },
  // ------------- Property Routes ------------------------
  {
    name: "Property",
    layout: "/admin",
    both: true,
    path: "/properties",
    icon: <Icon as={LuBuilding2} width='20px' height='20px' color='inherit' />,
    component: Property,
  },
  {
    name: "Property View",
    layout: "/admin",
    both: true,
    under: "properties",
    path: "/propertyView/:id",
    component: PropertyView,
  },

  // // ------------- Communication Integration Routes ------------------------
  // {
  //   name: "Communication Integration",
  //   layout: "/admin",
  //   both: true,
  //   path: "/communication-integration",
  //   icon: <Icon as={GiSatelliteCommunication} width='20px' height='20px' color='inherit' />,
  //   component: Communication,
  // },
  // ------------- Task Routes ------------------------
  {
    name: "Calender & Task",
    layout: "/admin",
    both: true,
    path: "/task",
    icon: <Icon as={FaTasks} width='20px' height='20px' color='inherit' />,
    component: Task,
  },
  // ------------- Document Routes ------------------------
  {
    name: "Documents",
    layout: "/admin",
    both: true,
    path: "/documents",
    icon: <Icon as={AiFillFolderOpen} width='20px' height='20px' color='inherit' />,
    component: Document,
  },
  // ----------------- Reporting Layout -----------------
  {
    name: "Reporting and Analytics",
    layout: "/admin",
    both: true,
    path: "/reporting-analytics",
    icon: <Icon as={MdInsertChartOutlined} width='20px' height='20px' color='inherit' />,
    component: Report,
  },
  // ------------- user Routes ------------------------
  {
    name: "Users",
    layout: "/admin",
    path: "/user",
    icon: <Icon as={HiUsers} width='20px' height='20px' color='inherit' />,
    component: User,
  },
  {
    name: "User View",
    both: true,
    layout: "/admin",
    under: "user",
    path: "/userView/:id",
    component: UserView,
  },
  // ========================== History ==========================
  // ------------- Email History Routes ------------------------
  // {
  //   // separator: 'History',
  //   name: "Email History",
  //   layout: "/admin",
  //   both: true,
  //   path: "/email-history",
  //   icon: <Icon as={AiOutlineMail} width='20px' height='20px' color='inherit' />,
  //   component: EmailHistory,
  // },
  // {
  //   name: "Email View",
  //   layout: "/admin",
  //   both: true,
  //   under: "email-history",
  //   path: "/EmailHistory/:id",
  //   component: EmailHistoryView,
  // },
  // // ------------- Phone History Routes ------------------------
  // {
  //   name: "Phone History",
  //   layout: "/admin",
  //   both: true,
  //   path: "/phone-call-history",
  //   icon: <Icon as={PiPhoneCallBold} width='20px' height='20px' color='inherit' />,
  //   component: PhoneCall,
  // },
  // {
  //   name: "Phone Call View",
  //   layout: "/admin",
  //   both: true,
  //   under: "phone-call-history",
  //   path: "/phone-call/:id",
  //   component: PhoneCallView,
  // },
  // // ------------- Text message History Routes ------------------------
  // {
  //   name: "Text Msg History",
  //   layout: "/admin",
  //   both: true,
  //   path: "/text-msg-history",
  //   icon: <Icon as={MdOutlineMessage} width='20px' height='20px' color='inherit' />,
  //   component: TextMsg,
  // },
  // {
  //   name: "Text Msg View",
  //   layout: "/admin",
  //   both: true,
  //   under: "text-msg-history",
  //   path: "/text-msg/:id",
  //   component: TextMsgView,
  // },
  // // ------------- Metting History Routes ------------------------
  // {
  //   name: "Metting History",
  //   layout: "/admin",
  //   both: true,
  //   path: "/metting-history",
  //   icon: <Icon as={SiGooglemeet} width='20px' height='20px' color='inherit' />,
  //   component: Metting,
  // },
  // {
  //   name: "Metting View",
  //   layout: "/admin",
  //   both: true,
  //   under: "metting-history",
  //   path: "/metting/:id",
  //   component: MettingView,
  // },
  // ========================== User layout ==========================

  // ========================== auth layout ==========================
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: SignInCentered,
  },
];

export default routes;

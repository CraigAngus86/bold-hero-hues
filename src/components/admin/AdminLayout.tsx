import * as React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import {
  Table as TableIcon,
  LayoutDashboard,
  CalendarDays,
  ImagePlus,
  Settings,
  Users,
  ListChecks,
  Archive,
  ListFilter
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SidebarNavItem, SidebarNav } from "@/components/ui/sidebar-nav"

interface DashboardShellProps {
  children?: React.ReactNode
  className?: string
}

const sidebarNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Fixtures",
    href: "/admin/fixtures",
    icon: <CalendarDays className="h-5 w-5" />,
  },
  {
    title: "Image Manager",
    href: "/admin/image-manager",
    icon: <ImagePlus className="h-5 w-5" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: "Scraped Data",
    href: "/admin/scraped-data",
    icon: <ListChecks className="h-5 w-5" />,
  },
  {
    title: "League Table",
    href: "/admin/league-table-management",
    icon: <TableIcon className="h-5 w-5" />,
  },
]

export function AdminLayout({
  children,
  className,
}: DashboardShellProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname()

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <header className="flex items-center justify-between py-4 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="text-lg font-semibold">Loading...</div>
          <ModeToggle />
        </header>
        <main className="flex-1 p-6">
          <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md h-full w-full"></div>
        </main>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between py-4 px-6">
          <a href="/" className="flex items-center space-x-2 font-semibold">
            <Icons.logo className="h-6 w-6" />
            <span className="hidden sm:inline-block">Banks o' Dee FC</span>
          </a>
          <ModeToggle />
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <div className="py-4">
            <SidebarNav items={sidebarNavItems} />
          </div>
        </ScrollArea>
        <Separator />
        <div className="py-4 px-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex h-8 w-full items-center justify-between rounded-md">
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "Avatar"} />
                  <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span>{session?.user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" forceMount>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="md:hidden pl-2"
          >
            <Icons.menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader className="text-left">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <ScrollArea className="my-2">
            <SidebarNav items={sidebarNavItems} closeMobileMenu={closeMobileMenu} />
          </ScrollArea>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex h-8 w-full items-center justify-between rounded-md">
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "Avatar"} />
                  <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span>{session?.user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" forceMount>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SheetContent>
      </Sheet>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}

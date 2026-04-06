'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X, Zap, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { AvatarDropdown } from '../AvatarDropdown';
import { ThemeTogglerButton } from '../animate-ui/components/buttons/theme-toggler';
import { parseXmlFiles } from '../../utils/step';
import { reactBasePrompt } from '@/constants/react';



export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isHome, setIsHome] = useState(false)
  const [isLoggedOut, setIsLoggedOut] = useState(false)


  const pathname = usePathname()
  const router = useRouter()
  const { scrollY } = useScroll();
  const { data: session } = authClient.useSession()

  useEffect(() => {
    // console.log("session --", session)
    setIsHome(pathname === "/")
  })

  const noNavbar = ["/builder", "/builder-streams"]
  if (noNavbar.includes(pathname)) {
    return null
  }

  useEffect(() => {
    setMounted(true);

    const unsubscribe = scrollY.on("change", (latest: number) => {
      setScrolled(latest > 20);
    });

    return () => unsubscribe();
  }, [scrollY]);

  if (!mounted) {
    return null;
  }


  // async function logout() {
  //   await authClient.signOut({
  //     fetchOptions: {
  //       onRequest: () => {
  //         setIsLoggedOut(true)
  //       },
  //       onSuccess: () => {
  //         setIsLoggedOut(false)
  //         toast("Succesfully logged out")
  //         router.push('/')
  //       },
  //       onError: () => {
  //         setIsLoggedOut(false)
  //         toast("Something went worng , Please try again")
  //       }
  //     }
  //   })

  // }
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-background/80 backdrop-blur-xl '
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-orange-500 to-pink-500">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Bolt.new
              </span>
            </div>
          </Link>

          {isHome && <div className="hidden md:flex items-center gap-8 rounded-md px-2 py-1">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
          </div>}

          <div className="flex items-center gap-4">
            {pathname !== "/builder" && 
            <ThemeTogglerButton size={"xs"} className='bg-black/70! dark:bg-white/70!' />
            // <button
            //   onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            //   className="p-2 rounded-lg hover:bg-accent transition-colors"
            //   aria-label="Toggle theme"
            // >
            //   {theme === 'dark' ? (
            //     <Sun className="w-5 h-5" />
            //   ) : (
            //     <Moon className="w-5 h-5" />
            //   )}
            // </button>
            }

            <div className="relative hidden md:flex items-center gap-4">
              {/* <Button variant="ghost" size="sm">
                Sign In
              </Button> */}
              {!session ?
                !["/signin", "/signup"].includes(pathname) && <>
                  <Link href="/signin" className='text-sm bg-linear-to-r from-orange-500 via-pink-500 to-orange-500 bg-clip-text hover:text-transparent animate-gradient'>Sign In</Link>
                  <Link href="/signup" className='text-sm bg-linear-to-r from-orange-500 via-pink-500 to-orange-500 bg-clip-text hover:text-transparent animate-gradient'>Sign up</Link>
                </>
                :
                ""
                // <Button
                //   size="sm"
                //   disabled={isLoggedOut}
                //   onClick={() => logout()}
                //   className="cursor-pointer hover:bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 duration-300 transition-colors"
                // >
                //   {isLoggedOut && <Loader className='animate-spin' /> }
                //   Log out
                // </Button>
              }
              
              {isHome && <Link href={session ? "/chat" : "/signin"}>
                <Button
                  size="sm"
                  className="cursor-pointer bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                  Get Started
                </Button>
              </Link>}
              
              { session && <AvatarDropdown/>}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/40"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                href="#features"
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>

              <div className="pt-3 space-y-2">
                {/* <Button variant="ghost" className="w-full">
                  Sign In
                </Button> */}
                <Button className="w-full bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}


import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					50: '#E6E7F0',
					100: '#C2C4DB',
					200: '#9A9DC5',
					300: '#7276AF',
					400: '#4A509A',
					500: '#232984',
					600: '#1A2075',
					700: '#111866',
					800: '#00105A',
					900: '#000A47',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					50: '#F5FBFF',
					100: '#E8F7FF',
					200: '#DCEEFF',
					300: '#C5E7FF',
					400: '#A3D5FF',
					500: '#75BEFF',
					600: '#47A6FF',
					700: '#1A8EFF',
					800: '#0076EC',
					900: '#0061C3',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					300: '#FFDF4D',
					400: '#FFD81A',
					500: '#FFD700',
					600: '#E6C200',
					700: '#CCAC00',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				team: {
					blue: '#00105a',
					lightBlue: '#c5e7ff',
					navy: '#000c40',
					gray: '#f0f0f0',
					darkGray: '#333333',
					red: '#CF142B',
					white: '#FFFFFF',
					gold: '#FFD700',
				},
				gray: {
					50: '#F9FAFB',
					100: '#F3F4F6',
					200: '#E5E7EB',
					300: '#D1D5DB',
					400: '#9CA3AF',
					500: '#6B7280',
					600: '#4B5563',
					700: '#374151',
					800: '#1F2937',
					900: '#111827',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				sans: ['Open Sans', 'system-ui', 'sans-serif'],
				heading: ['Montserrat', 'system-ui', 'sans-serif'],
				display: ['Montserrat', 'system-ui', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'team': '0 4px 14px 0 rgba(0, 16, 90, 0.1)',
				'card': '0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05)',
				'card-hover': '0 15px 35px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)',
				'button': '0 4px 6px rgba(0, 0, 0, 0.1)',
				'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
			},
			backgroundImage: {
				'primary-gradient': 'linear-gradient(135deg, #00105A 0%, #001A8D 100%)',
				'accent-gradient': 'linear-gradient(135deg, #00105A 0%, #FFD700 100%)',
				'focus-gradient': 'linear-gradient(135deg, #001A8D 0%, #0026C2 100%)',
				'card-gradient': 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0))',
				'diagonal-pattern': 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%), linear-gradient(225deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%), linear-gradient(315deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%), linear-gradient(45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(10px)'
					}
				},
				'slide-in': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				'slide-out': {
					'0%': {
						transform: 'translateX(0)'
					},
					'100%': {
						transform: 'translateX(-100%)'
					}
				},
				'scale-up': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'background-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'pulse': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				},
				'border-pulse': {
					'0%, 100%': { borderColor: 'rgba(255, 215, 0, 0.6)' },
					'50%': { borderColor: 'rgba(255, 215, 0, 1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'fade-out': 'fade-out 0.4s ease-out',
				'slide-in': 'slide-in 0.6s ease-out',
				'slide-out': 'slide-out 0.6s ease-out',
				'scale-up': 'scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
				'background-shift': 'background-shift 30s ease infinite',
				'pulse': 'pulse 2s infinite ease-in-out',
				'border-pulse': 'border-pulse 2s infinite ease-in-out'
			},
			spacing: {
				'section': '2rem',
				'card': '1rem',
				'element': '0.5rem',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

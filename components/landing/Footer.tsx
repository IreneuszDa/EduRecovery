// components/landing/Footer.tsx
'use client';

import React from 'react';

// Kontener dla ikon dla spójnego stylu i efektu hover
const SocialIcon = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
        {children}
    </a>
);

// --- IKONY SVG ---

const FacebookIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z"></path>
    </svg>
);

const InstagramIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"></path>
        <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"></path>
        <path fillRule="evenodd" clipRule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"></path>
    </svg>
);

const TikTokIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M16.8217 5.1344C16.0886 4.29394 15.6479 3.19805 15.6479 2H14.7293M16.8217 5.1344C17.4898 5.90063 18.3944 6.45788 19.4245 6.67608C19.7446 6.74574 20.0786 6.78293 20.4266 6.78293V10.2191C18.645 10.2191 16.9932 9.64801 15.6477 8.68211V15.6707C15.6477 19.1627 12.8082 22 9.32386 22C7.50043 22 5.85334 21.2198 4.69806 19.98C3.64486 18.847 2.99994 17.3331 2.99994 15.6707C2.99994 12.2298 5.75592 9.42509 9.17073 9.35079M16.8217 5.1344C16.8039 5.12276 16.7861 5.11101 16.7684 5.09914M6.9855 17.3517C6.64217 16.8781 6.43802 16.2977 6.43802 15.6661C6.43802 14.0734 7.73249 12.7778 9.32394 12.7778C9.62087 12.7778 9.9085 12.8288 10.1776 12.9124V9.40192C9.89921 9.36473 9.61622 9.34149 9.32394 9.34149C9.27287 9.34149 8.86177 9.36884 8.81073 9.36884M14.7244 2H12.2097L12.2051 15.7775C12.1494 17.3192 10.8781 18.5591 9.32386 18.5591C8.35878 18.5591 7.50971 18.0808 6.98079 17.3564" strokeLinejoin="round" strokeWidth="1.5"></path>
    </svg>
);

const LinkedInIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"/>
    </svg>
);


export default function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="xl:grid xl:grid-cols-5 xl:gap-8">
                    {/* Sekcja z logo i informacjami */}
                    <div className="space-y-6 xl:col-span-2">
                        <a href="/" className="flex items-center space-x-3">
                            <img className="h-10 w-auto" src="/logo1t.png" alt="Uczmy.pl Logo" />
                            <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">Uczmy.pl</span>
                        </a>
                        <p className="text-gray-500 dark:text-gray-400 text-base max-w-xs">
                            Rewolucjonizujemy edukację, dostarczając narzędzia przyszłości dla szkół i uczniów.
                        </p>
                        <a className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex h-3 w-3 relative mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            Wszystkie systemy działają poprawnie
                        </a>
                    </div>

                    {/* Sekcja z linkami */}
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-3 md:grid-cols-3">
                        <div className="mt-12 md:mt-0">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Pomoc</h3>
                            <ul role="list" className="mt-4 space-y-4">
                                <li><a href="/help" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Centrum Pomocy</a></li>
                                <li><a href="/kontakt" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Kontakt</a></li>
                            </ul>
                        </div>
                        <div className="mt-12 md:mt-0">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Informacje prawne</h3>
                            <ul role="list" className="mt-4 space-y-4">
                                <li><a href="/regulamin" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Regulamin</a></li>
                                <li><a href="/polityka-prywatnosci" className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Polityka prywatności</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Dolna belka z copyright i social media */}
                <div className="mt-12 border-t border-gray-200 dark:border-slate-800 pt-8 md:flex md:items-center md:justify-between">
                    <div className="flex space-x-6 md:order-2">
                        <SocialIcon href="https://www.facebook.com/profile.php?id=61577132242089">
                            <FacebookIcon />
                        </SocialIcon>
                        <SocialIcon href="https://www.instagram.com/uczmypl/">
                            <InstagramIcon />
                        </SocialIcon>
                        <SocialIcon href="https://www.tiktok.com/@uczmypl">
                            <TikTokIcon />
                        </SocialIcon>
                        <SocialIcon href="https://www.linkedin.com/company/uczmy-pl/">
                            <LinkedInIcon />
                        </SocialIcon>
                    </div>
                    <p className="mt-8 text-base text-gray-400 dark:text-gray-500 md:mt-0 md:order-1">
                        © {new Date().getFullYear()} Uczmy.pl Wszelkie prawa zastrzeżone.
                    </p>
                </div>
            </div>
        </footer>
    );
}
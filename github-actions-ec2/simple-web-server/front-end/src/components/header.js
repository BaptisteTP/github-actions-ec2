import breezyLogo from "@/assets/breezy.png";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { useThemeLang } from '@/context/ThemeLangContext';

export default function Header({ onBurgerClick  }) {
  const [user, setUser] = useState(null);
  const { themeClasses } = useThemeLang();

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) return;

      let userId;
      try {
        const decoded = jwtDecode(token);
        userId = decoded.userId;
        if (!userId) throw new Error();
      } catch {
        console.error("Token JWT invalide.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:4001/api/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Erreur utilisateur");
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Erreur récupération user :", err.message);
      }
    }

    fetchUser();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b rounded-b-md py-2 px-6 flex items-center w-full h-16 bg-white dark:bg-gray-900"
          style={{ zIndex: 10, position: 'fixed', left: 0, top: 0 }}
>

      {/* Burger à gauche */}
      <button
          onClick={onBurgerClick}
          aria-label="Ouvrir le menu"
          className="p-2 mr-4"
      >
        {/* Icône burger */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
             className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <Image
          src={breezyLogo}
          alt="Logo Breezy"
          className="h-8 w-auto"
          priority
        />
      </div>

      <div className="h-10 w-10" />
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<string>("checking...");

  useEffect(() => {
    // Check backend health
    fetch("http://localhost:8000/api/health")
      .then((res) => res.json())
      .then((data) => setBackendStatus(data.status))
      .catch(() => setBackendStatus("offline"));

    // Fetch items from FastAPI backend
    fetch("http://localhost:8000/api/items")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch items");
        return res.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <main className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Next.js + FastAPI Demo
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Backend Status:
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                backendStatus === "healthy"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {backendStatus}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Items from FastAPI Backend
          </h2>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading items...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">
                Error: {error}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Make sure the FastAPI backend is running on http://localhost:8000
              </p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            API Endpoints Available
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                GET http://localhost:8000/api/health
              </code>
            </li>
            <li>
              <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                GET http://localhost:8000/api/items
              </code>
            </li>
            <li>
              <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                GET http://localhost:8000/api/items/:id
              </code>
            </li>
            <li>
              <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                POST http://localhost:8000/api/items
              </code>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

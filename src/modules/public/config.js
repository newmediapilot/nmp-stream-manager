export const signalsConfig = [
    {
        theme: "orange",
        href: "/public/signal/create?type=ad&description=30",
        wait: "30000",
        label: "📢 Start Ad (30s)",
    },
    {
        theme: "orange",
        wait: "60000",
        href: "/public/signal/create?type=ad&description=60",
        label: "📢 Start Ad (60s)",
    },
    {
        theme: "orange",
        wait: "120000",
        href: "/public/signal/create?type=ad&description=120",
        label: "📢 Start Ad (2min)",
    },
    {
        theme: "orange",
        wait: "180000",
        href: "/public/signal/create?type=ad&description=180",
        label: "📢 Start Ad (3min)",
    },
    {
        theme: "aqua",
        wait: "3000",
        href: "/public/signal/create?type=heart&description=heart",
        label: "❤ Heart Rate",
    },
    {
        theme: "blue",
        wait: "3000",
        href: "/public/signal/create?type=mark&description={{ 'lobby:start' | urlencode }}",
        label: "🏰 Enter Lobby",
    },
    {
        theme: "purple",
        wait: "3000",
        href: "/public/signal/create?type=mark&description={{ 'match:start' | urlencode }}",
        label: "📡 Join Match",
    },
    {
        theme: "purple",
        wait: "3000",
        href: "/public/signal/create?type=mark&description={{ 'match:enter' | urlencode }}",
        label: "🌎 Enter Match",
    },
    {
        theme: "pink",
        wait: "3000",
        href: "/public/signal/create?type=mark&description={{ 'match:fight:start' | urlencode }}",
        label: "🥊 Fight",
    },
    {
        theme: "pink",
        wait: "3000",
        href: "/public/signal/create?type=mark&description={{ 'match:fight:end' | urlencode }}",
        label: "🌟 Clear",
    },
    {
        theme: "deepyellow",
        wait: "3000",
        href: "/public/signal/create?type=mark&description={{ 'match:travel:start' | urlencode }}",
        label: "🏃 Travel",
    },
    {
        theme: "deepyellow",
        wait: "3000",
        href: "/public/signal/create?type=mark&description={{ 'match:travel:end' | urlencode }}",
        label: "🧍 Idle",
    },
    {
        theme: "green",
        wait: "3000",
        href: "/public/signal/create?type=mark&description={{ 'match:win' | urlencode }}",
        label: "🏆 Win",
    },
    {
        theme: "red",
        wait: "3000",
        href: "/public/signal/create?type=mark&description={{ 'match:lose' | urlencode }}",
        label: "🤕 Lose",
    }
];
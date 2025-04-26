function App() {
    return (
        <main>
            <div className="vercel-halt">
                <h1>New Announcement!</h1>
                <p>SEKAI Stories will be moving to another site!</p>

                <button
                    className="btn-regular btn-orange"
                    onClick={() =>
                        (window.location.href =
                            "https://ko-fi.com/post/SEKAI-Stories-Relaunching-to-Cloudflare-Pages-T6T41E311K")
                    }
                >
                    Ko-fi Announcement
                </button>
            </div>
        </main>
    );
}

export default App;

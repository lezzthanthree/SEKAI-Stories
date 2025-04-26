function App() {
    return (
        <main>
            <div className="vercel-halt">
                <h3>SEKAI Stories has moved to a new domain.</h3>

                <button
                    className="btn-regular btn-orange"
                    onClick={() =>
                        (window.location.href =
                            "https://sekai-stories.pages.dev")
                    }
                >
                    Continue to SEKAI Stories
                </button>
                <a href="https://ko-fi.com/post/SEKAI-Stories-Relaunching-to-Cloudflare-Pages-T6T41E311K">
                    Previous announcement
                </a>
            </div>
        </main>
    );
}

export default App;

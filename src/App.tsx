function App() {
    return (
        <main>
            <div className="vercel-halt">
                <h1>Not so fast!</h1>
                <p>SEKAI Stories will launch on April 27th, 00:00 JST!</p>
                <p>For now, see this Nene playing CHUNITHM.</p>
                <p></p>
                <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/a0cx1PVf1t4"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
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

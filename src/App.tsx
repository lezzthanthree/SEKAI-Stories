function App() {
    return (
        <main>
            <div className="vercel-halt">
                <p>
                    SEKAI Stories has been paused due to exceeding the
                    bandwidth limit.
                </p>
                <p>For more information, see this announcement.</p>

                <button
                    className="btn-regular btn-blue"
                    onClick={() =>
                        (window.location.href = "https://ko-fi.com/post/SEKAI-Stories-Important-Announcement-A0A01DXJW5")
                    }
                >
                    Ko-fi Announcement
                </button>
            </div>
        </main>
    );
}

export default App;

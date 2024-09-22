import { useEffect, useState, useRef } from 'react';
import BlurFade from "@/components/magicui/blur-fade";
import FlickeringGrid from "../components/magicui/flickering-grid";
import LetterPullup from "@/components/magicui/letter-pullup";
import ShinyButton from "@/components/magicui/shiny-button";

const ClubProposal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {

        // Disable horizontal scrolling
        document.body.style.overflowX = 'hidden';
        // Enable vertical scrolling
        document.body.style.overflowY = 'auto';

        // Intersection Observer for fade-in effect
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect(); // Stop observing after it becomes visible
            }
        }, { threshold: 0.1 });

        if (formRef.current) {
            observer.observe(formRef.current);
        }

        // Cleanup function to reset the overflow property on unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const [clubName, setClubName] = useState('');
    const [clubRoom, setClubRoom] = useState('');
    const [proposalContent, setProposalContent] = useState('');
    const [authenticityScore, setAuthenticityScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendProposal = async () => {
        setLoading(true);
        setError(null); // Reset error state before making request

        try {
            const response = await fetch("http://127.0.0.1:8000/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: proposalContent }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setAuthenticityScore(data.authenticity_score);
        } catch (error) {
            setError("Failed to fetch authenticity score. Please try again.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        sendProposal();
        
        const newClub = {
            _id: "",
            clubName: clubName,
            clubRoom: clubRoom,
            proposal: proposalContent,
            authenticityScore: authenticityScore,
        };
        try {
            const response = await fetch('/api/makeClub', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(newClub),
            });
      
            const data = await response.json();
            if (response.ok) {
              console.log('Club added:', data);
              navigate('/login');
            } else {
              console.error('Error:', data);
            }
        } catch (error) {
            console.error('Error sending user data:', error);
        }
    };

    return (
        <div className="tw-flex tw-items-center tw-justify-center tw-min-h-screen tw-bg-gradient-to-r tw-from-blue-950 tw-to-blue-200 tw-py-8">
            <FlickeringGrid
                className="tw-z-0 tw-absolute tw-inset-0 tw-h-screen tw-w-screen"
                squareSize={3}
                gridGap={7}
                color="#6B7280"
                maxOpacity={0.5}
                flickerChance={0.1}
                height={1000}
                width={2000}
            />
            <div ref={formRef} className="tw-bg-blue-900 tw-shadow-lg tw-rounded-lg tw-p-8 tw-max-w-lg tw-w-full tw-z-10 tw-h-screen">
                <BlurFade inView={isVisible}>
                    <div>
                        <LetterPullup words={"Submit Your Club Proposal"} delay={0.05} className="tw-text-2xl tw-font-bold tw-text-center tw-text-white tw-mb-6"/>
                        <form onSubmit={handleSubmit}>
                            <div className="tw-mb-4">
                                <label className="tw-block tw-text-gray-300 tw-mb-2" htmlFor="clubName">
                                    Club Name
                                </label>
                                <input
                                    type="text"
                                    id="clubName"
                                    className="tw-w-full tw-p-3 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-blue-500 focus:outline-none"
                                    placeholder="Your Club's Name"
                                    onChange={(e) => setClubName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="tw-mb-4">
                                <label className="tw-block tw-text-gray-300 tw-mb-2" htmlFor="clubRoom">
                                    Club Room No.
                                </label>
                                <input
                                    type="text"
                                    id="clubRoom"
                                    className="tw-w-full tw-p-3 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-blue-500 focus:outline-none"
                                    placeholder="Your Club's Room Number"
                                    onChange={(e) => setClubRoom(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="tw-mb-4">
                                <label className="tw-block tw-text-gray-300 tw-mb-2" htmlFor="proposal">
                                    Club Proposal
                                </label>
                                <textarea
                                    id="proposal"
                                    className="tw-w-full tw-p-3 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-blue-500 focus:outline-none"
                                    placeholder="Enter your club proposal here..."
                                    rows="6"
                                    value={proposalContent}
                                    onChange={(e) => setProposalContent(e.target.value)}
                                    required
                                />
                            </div>
                            <ShinyButton
                                type="analyze"
                                className="tw-w-full tw-p-3 tw-rounded-lg tw-bg-zinc-300 tw-border-2 tw-border-zinc-600"
                                disabled={loading}
                                onClick={sendProposal}
                            >
                                {loading ? 'Analyzing...' : 'Analyze Proposal'}
                            </ShinyButton>
                            <ShinyButton
                                type="submit"
                                className="tw-w-full tw-p-3 tw-rounded-lg tw-bg-zinc-300 tw-border-2 tw-border-zinc-600"
                                disabled={loading}
                            >
                                {loading ? 'Analyzing...' : 'Submit Club'}
                            </ShinyButton>
                        </form>

                        {/* Display authenticity score or error */}
                        {authenticityScore !== null && (
                            <p className="tw-mt-4 tw-text-center tw-text-green-500">
                                Authenticity Score: {authenticityScore}
                            </p>
                        )}
                        {error && (
                            <p className="tw-mt-4 tw-text-center tw-text-red-500">
                                {error}
                            </p>
                        )}
                    </div>
                </BlurFade>
            </div>
        </div>
    );
};

export default ClubProposal;

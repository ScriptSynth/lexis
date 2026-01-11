import { Feed } from "@/components/Feed";
import { RightSidebar } from "@/components/RightSidebar";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white relative">
            {/* Content Wrapper - Add right margin on XL to account for fixed RightSidebar */}
            <div className="xl:mr-80">
                <Feed />
            </div>

            <RightSidebar />
        </div>
    );
}

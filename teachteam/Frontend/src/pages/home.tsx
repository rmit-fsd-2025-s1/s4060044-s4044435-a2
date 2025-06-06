
import Navbar from "../Components/Navbar";
import Cards from '@/Components/Cards';


const HomePage = () => {
const lectureImg = "/images/lecturer.jpg"
const tutorImg = "/images/tutor.jpg"

  return (
    <div className="homepage-container">
      <Navbar />
      <header className="homepage-header">
        <h1>Welcome to the TeachTeam</h1>
        <p>
          This platform connects tutors and lecturers, allowing them to collaborate, manage tutor applications, and facilitate a productive learning environment. Whether you&apos;re a tutor looking for students or a lecturer needing to review tutor applications, this app is designed to make the process seamless.
        </p>
      </header>
      <div className='cards-container'>
      <Cards
        title='Become a Lecturer - Share Your Knowledge'
        description = "Join our platform as a lecturer and make a difference. Teach various subjects, engage with learners, and enjoy seamless tools and support."
        imageSrc = {tutorImg}
      />
      <Cards
        title='Become a Tutor - Empower Students to Succeed'
        description = "Become a tutor and help students reach their academic goals. Share your expertise, manage sessions, and make a lasting impact."
        imageSrc = {lectureImg}
      />
      </div>

    </div>
  );
};

export default HomePage;

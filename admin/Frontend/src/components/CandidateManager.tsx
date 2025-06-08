import { gql, useMutation, useQuery } from "@apollo/client";

// Define the TypeScript interface for a candidate with user details
interface CandidateWithUser {
  candidateId: number;
  user: {
    name: string;
    email: string;
    isBlocked: boolean;
  };
}

// GraphQL query to get candidates who were selected
const GET_CANDIDATES = gql`
  query {
    candidatesWithManySelections {
      candidateId
      user {
        name
        email
        isBlocked
      }
    }
  }
`;
// GraphQL mutation to block a candidate
const BLOCK = gql`
  mutation($candidateId: ID!) {
    blockCandidate(candidateId: $candidateId) {
      candidateId
      user { isBlocked }
    }
  }
`;

// GraphQL mutation to unblock a candidate
const UNBLOCK = gql`
  mutation($candidateId: ID!) {
    unblockCandidate(candidateId: $candidateId) {
      candidateId
      user { isBlocked }
    }
  }
`;

export default function CandidateManager() {
    // Fetch candidate data from the server
  const { data, refetch } = useQuery(GET_CANDIDATES);
  const [blockCandidate] = useMutation(BLOCK);
  const [unblockCandidate] = useMutation(UNBLOCK);

  const toggleBlock = async (id: number, isBlocked: boolean) => {   // Prepare mutation functions for block and unblock

    if (isBlocked) {// If currently blocked, unblock the candidate; otherwise, block them

      await unblockCandidate({ variables: { candidateId: id } });
    } else {
      await blockCandidate({ variables: { candidateId: id } });
    }
        // Refresh the list after update

    refetch();
  };

  return (
    <div className="course-container">
      <h3>Candidate Access Manager</h3>
      <ul className="course-list">
        {data?.candidatesWithManySelections.map((c: CandidateWithUser) => (
          <li key={c.candidateId}>
            {c.user.name} ({c.user.email}) — {c.user.isBlocked ? "Blocked" : "Active"}
            <button
              className={`dashboard-btn ${c.user.isBlocked ? "blue" : "red"}`}
              onClick={() => toggleBlock(c.candidateId, c.user.isBlocked)}
            >
              {c.user.isBlocked ? "Unblock" : "Block"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

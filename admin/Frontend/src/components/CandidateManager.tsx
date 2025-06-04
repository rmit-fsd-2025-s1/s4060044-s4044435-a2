import { gql, useMutation, useQuery } from "@apollo/client";

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

const BLOCK = gql`
  mutation($candidateId: ID!) {
    blockCandidate(candidateId: $candidateId) {
      candidateId
      user { isBlocked }
    }
  }
`;

const UNBLOCK = gql`
  mutation($candidateId: ID!) {
    unblockCandidate(candidateId: $candidateId) {
      candidateId
      user { isBlocked }
    }
  }
`;

export default function CandidateManager() {
  const { data, refetch } = useQuery(GET_CANDIDATES);
  const [blockCandidate] = useMutation(BLOCK);
  const [unblockCandidate] = useMutation(UNBLOCK);

  const toggleBlock = async (id: number, isBlocked: boolean) => {
    if (isBlocked) {
      await unblockCandidate({ variables: { candidateId: id } });
    } else {
      await blockCandidate({ variables: { candidateId: id } });
    }
    refetch();
  };

  return (
    <div>
      <h3>Candidate Access Manager</h3>
      <ul>
        {data?.candidatesWithManySelections.map((c: any) => (
          <li key={c.candidateId}>
            {c.user.name} ({c.user.email}) — {c.user.isBlocked ? "Blocked" : "Active"}
            <button onClick={() => toggleBlock(c.candidateId, c.user.isBlocked)}>
              {c.user.isBlocked ? "Unblock" : "Block"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

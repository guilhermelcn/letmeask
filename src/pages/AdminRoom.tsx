import { useParams, useHistory } from "react-router-dom";

import logoImage from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";

import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";

import { database } from "../services/firebase";

import "../styles/room.scss";

interface RoomParams {
  id: string;
}

export function AdminRoom() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);
  const history = useHistory();

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleCheckQuestionAsAnswered(id: string) {
    await database.ref(`rooms/${roomId}/questions/${id}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(id: string) {
    await database.ref(`rooms/${roomId}/questions/${id}`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteQuestion(id: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${id}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImage} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(
            ({ id, content, author, isAnswered, isHighlighted }) => {
              return (
                <Question
                  key={id}
                  content={content}
                  author={author}
                  isAnswered={isAnswered}
                  isHighlighted={isHighlighted}
                >
                  {!isAnswered && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCheckQuestionAsAnswered(id)}
                      >
                        <img
                          src={checkImg}
                          alt="Marcar pergunta como respondida"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHighlightQuestion(id)}
                      >
                        <img src={answerImg} alt="Dar destaque á pergunta" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                </Question>
              );
            }
          )}
        </div>
      </main>
    </div>
  );
}

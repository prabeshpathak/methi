import React from "react";
import { connect } from "react-redux";
import { useJitsi } from "react-jutsu";
import { useState, useEffect } from "react";

const Jitsu = ({ user }) => {
  const [fullName, setFullName] = useState("");
  useEffect(() => {
    if (user) setFullName(user.fullName);
  }, [user]);

  const jitsiConfig = {
    roomName: `Team Call ${
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    }`,
    displayName: fullName,
    password: "",
    subject: "Team Meeting for Scrum",
    configOverwrite: {
      startAudioMuted: true,
      startVideoMuted: true,
    },
    interfaceConfigOverwrite: {
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      DEFAULT_BACKGROUND: "#101010",
    },
    parentNode: "jitsi-container",
  };
  const { error } = useJitsi(jitsiConfig);

  return (
    <div>
      {error && <p>{error}</p>}
      <div
        id={jitsiConfig.parentNode}
        style={{
          ...{
            width: "100vw",
            height: "92vh",
            overflow: "hidden",
          },
        }}
      />
    </div>
  );
};
const mapStateToProps = (state) => ({
  user: state.reducer.user,
});

export default connect(mapStateToProps)(Jitsu);

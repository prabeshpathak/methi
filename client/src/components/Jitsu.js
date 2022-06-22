import React from "react";
import { useJitsi } from "react-jutsu";

const Jitsu = () => {
  const jitsiConfig = {
    roomName: '',
    displayName: '',
    password: '',
    subject: '',
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
            height: "100vh",
          },
        }}
      />
    </div>
  );
};

export default Jitsu;
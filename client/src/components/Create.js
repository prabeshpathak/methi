import React, { useEffect, useState } from "react";
import api from "../axios";

const fetchData = async () => {
  const response = await api.get("/issues");
  return response.data;
};
const Create = () => {
  return <></>;
};

export default Create;

import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { Input } from 'antd';

export default function UserForm() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const curUser = useSelector((state: RootState) => state.common.curUser);

  return (
    <form className="container mx-auto px-3 mt-7">
      <div className="bg-c-light rounded pt-4 pl-6">
        <FontAwesomeIcon
          icon={faLongArrowAltLeft}
          className="text-3xl cursor-pointer"
        />

        {curUser && (
          <h2 className="text-center text-xl font-bold mb-8">
            {curUser.FirstName} {curUser.LastName}
          </h2>
        )}

        <div>
          
        </div>
      </div>
    </form>
  );
}

<?php

namespace App\Http\Controllers;


use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        
        $users = User::all();
        return response()->json($users);
    }

    public function show($id)
    {
        // Return the 'name' of a specific user
        $user = User::findOrFail($id);
        return response()->json(['name' => $user->name]);
    }
}
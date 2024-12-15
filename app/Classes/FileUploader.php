<?php

namespace App\Classes;

use Illuminate\Support\Facades\Storage;

class FileUploader
{
    protected $baseDir;
    protected $thumbDir;
    protected $baseUrl;
    public function __construct()
    {
        $this->baseDir = config('uploader.baseDir');
        $this->thumbDir = config('uploader.thumbDir');
        $this->baseUrl = config('uploader.baseUrl');
    }

    protected function createDirectories($email)
    {
        $folderName = current(explode('@', $email));
        $userFolder = 'public/' . $folderName . '/' . $this->baseDir; // vubaokhanh/image/
        $userThumbFolder = 'public/' . $folderName . '/' . $this->thumbDir;

        if (!Storage::exists($userFolder)) {
            Storage::makeDirectory($userFolder);
        }

        if (!Storage::exists($userThumbFolder)) {
            Storage::makeDirectory($userThumbFolder);
        }
    }

    protected function uploadFile() {}

    public function upload($request, $user)
    {
        return $this->createDirectories($user->email);
    }
}

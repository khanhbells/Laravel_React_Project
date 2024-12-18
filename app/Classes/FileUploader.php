<?php

namespace App\Classes;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Imagick\Driver;

class FileUploader
{
    protected $baseDir;
    protected $email;
    protected ImageManager $imageManager;

    public function __construct($email)
    {
        $this->baseDir = config('uploader.baseDir');
        $this->email = $email;
        $this->imageManager = new ImageManager(new Driver());
    }

    public function uploadFile(UploadedFile $file, string $type = 'image', ?array $customFolder = null): string
    {
        //validate
        $this->validateFile($file, $type);

        $folderStructure = $this->createFolderStructure($type, $customFolder);
        $fileName = $this->generateFilename($file);

        $path = $folderStructure[$type] . '/' . $fileName;

        Storage::putFileAs($folderStructure[$type], $file, $fileName);

        if ($type === 'image' && isset($folderStructure['thumb'])) {
            $this->createThumbnails($folderStructure, $fileName);
        }

        return $path;
    }

    //implode bung mảng thành 1 chuỗi theo gì đó
    protected function validateFile(UploadedFile $file, string $type): void
    {
        $validator = Validator::make(
            ['file' => $file],
            [
                'file' => [
                    'required',
                    'file',
                    'mimes:' . implode(',', config('uploader.allowed_types.' . $type)),
                    'max:' . config('uploader.max_file_size')
                ]
            ]
        );
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }

    protected function createFolderStructure(string $type, ?array $customFolder = null): array
    {

        $emailPrefix = Str::before($this->email, '@');
        $basePath = 'public/' . $emailPrefix;
        $defaultFolder = config('uploader.default_folder.' . $type); //array
        $folder = [
            'main' => $basePath
        ];
        foreach ($defaultFolder as $key => $subFolder) {
            $folder[$subFolder] = $basePath . '/' . $subFolder;
            if ($customFolder) {
                foreach ($customFolder as $subCustomFolder) {
                    $folder[$subFolder] = $folder[$subFolder] . '/' . $subCustomFolder;
                }
            }
        }

        foreach ($folder as $f) {
            if (!Storage::exists($f)) {
                Storage::makeDirectory($f);
            }
        }

        return $folder;
    }

    //Tao ten anh moi
    protected function generateFilename(UploadedFile $file)
    {
        return Str::uuid() . '.' . $file->clientExtension();
    }

    //Tao anh thumbnails
    protected function createThumbnails(array $folderStructure, string $fileName): void
    {
        $originalPath = storage_path('app/' . $folderStructure['image'] . '/' . $fileName);
        $image = $this->imageManager->imagick()->read($originalPath);

        $imageWidth = $image->width();
        $imageHeight = $image->height();

        $aspecratio = $imageWidth / $imageHeight;

        foreach (config('uploader.thumb_size') as $size => $dimension) {
            $thumbPath = storage_path('app/' . $folderStructure['thumb'] . '/' . $size . '_' . $fileName);


            $image->resize($dimension['width'], $dimension['height'], function ($constraint) {
                $constraint->aspectRatio(); // dieu chinh kich thuoc theo chieu nao do
                $constraint->upsize(); // lam cho anh khong to hon so voi anh goc
            })->save($thumbPath);
        }
    }
}
